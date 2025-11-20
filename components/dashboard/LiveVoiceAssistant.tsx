import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob, FunctionDeclaration, Type } from "@google/genai";
import type { ViewType } from '../../types';
import { ACCOUNTS, TRANSACTIONS, CONTACTS } from '../../constants';
import { formatCurrency } from '../../utils/formatters';
import { useDashboard } from '../../contexts/DashboardContext';
import { EXCHANGE_RATES } from '../../i18n';

// Define available functions for the model
const functionDeclarations: FunctionDeclaration[] = [
    {
        name: 'getAccountBalance',
        parameters: {
            type: Type.OBJECT,
            description: 'Get the current balance for a specific account type.',
            properties: {
                accountType: {
                    type: Type.STRING,
                    description: 'The type of account, e.g., "Checking" or "Savings".'
                }
            },
            required: ['accountType']
        }
    },
    {
        name: 'getRecentTransactions',
        parameters: {
            type: Type.OBJECT,
            description: 'Get a list of the most recent transactions.',
            properties: {
                limit: {
                    type: Type.NUMBER,
                    description: 'The number of recent transactions to retrieve. Defaults to 5.'
                }
            },
        }
    },
    {
        name: 'initiateTransfer',
        parameters: {
            type: Type.OBJECT,
            description: 'Initiate a money transfer to a known contact.',
            properties: {
                recipientName: {
                    type: Type.STRING,
                    description: 'The name of the person to send money to.'
                },
                amount: {
                    type: Type.NUMBER,
                    description: 'The amount of money to send.'
                },
                note: {
                    type: Type.STRING,
                    description: 'An optional note or memo for the transfer.'
                }
            },
            required: ['recipientName', 'amount']
        }
    },
    {
        name: 'performCurrencyExchange',
        parameters: {
            type: Type.OBJECT,
            description: 'Converts an amount from a source currency to a target currency using live exchange rates.',
            properties: {
                amount: {
                    type: Type.NUMBER,
                    description: 'The amount of money to convert.'
                },
                sourceCurrency: {
                    type: Type.STRING,
                    description: 'The 3-letter ISO currency code to convert from, e.g., "USD", "EUR", "SEK".'
                },
                targetCurrency: {
                    type: Type.STRING,
                    description: 'The 3-letter ISO currency code to convert to, e.g., "USD", "EUR", "SEK".'
                }
            },
            required: ['amount', 'sourceCurrency', 'targetCurrency']
        }
    }
];


// --- Helper Functions ---
function encode(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): Blob {
  const int16 = new Int16Array(data.length);
  for (let i = 0; i < data.length; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

const getSystemInstruction = () => {
    const accountSummary = ACCOUNTS.map(a => `${a.type}: ${formatCurrency(a.balance)}`).join(', ');
    const transactionSummary = TRANSACTIONS.slice(0, 3).map(t => `${t.description} (${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)})`).join('; ');
    
    return `You are a professional, friendly, and helpful banking assistant for the Swedish Construction Bank.
    Your primary role is to assist users by using the available functions to answer their questions about account balances,
    transaction history, and to help them initiate money transfers. When a function call returns a result object, use the 'message'
    property from that object as your primary response to the user. Be concise and clear.

    Here is a summary of the user's current financial context. Use this information to answer questions directly if possible, before resorting to function calls.
    - User's Accounts: ${accountSummary}
    - Last 3 Transactions: ${transactionSummary}`;
};


// --- Component ---
type AssistantStatus = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'SPEAKING';

interface LiveVoiceAssistantProps {
    isOpen: boolean;
    onClose: () => void;
    setActiveView: (view: ViewType) => void;
}

const LiveVoiceAssistant: React.FC<LiveVoiceAssistantProps> = ({ isOpen, onClose, setActiveView }) => {
    const { addReceiptAndNavigate } = useDashboard();
    const [status, setStatus] = useState<AssistantStatus>('IDLE');
    const [statusText, setStatusText] = useState('Tap the orb to speak');
    const [isConfigured, setIsConfigured] = useState(false);

    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const audioContextRefs = useRef<{ input: AudioContext | null, output: AudioContext | null, sources: Set<AudioBufferSourceNode> }>({ input: null, output: null, sources: new Set() });
    const streamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const nextStartTimeRef = useRef(0);
    const aiRef = useRef<GoogleGenAI | null>(null);

    // --- Business Logic Functions ---
    const getAccountBalance = useCallback(({ accountType }: { accountType: string }) => {
        const account = ACCOUNTS.find(a => a.type.toLowerCase() === accountType.toLowerCase());
        if (account) {
            return {
                status: 'SUCCESS',
                message: `The balance for your ${account.type} account is ${formatCurrency(account.balance)}.`,
                balance: account.balance
            };
        }
        return {
            status: 'ERROR',
            message: `Sorry, I couldn't find a ${accountType} account.`
        };
    }, []);

    const getRecentTransactions = useCallback(({ limit = 5 }: { limit?: number }) => {
        const transactions = TRANSACTIONS.slice(0, limit);
        const summary = transactions.map(t => `${t.description} for ${formatCurrency(t.amount)}`).join(', ');
        return {
            status: 'SUCCESS',
            message: `Here are your last ${transactions.length} transactions: ${summary}.`,
            transactions: transactions.map(t => ({ description: t.description, amount: t.amount, type: t.type }))
        };
    }, []);

    const initiateTransfer = useCallback(({ recipientName, amount, note }: { recipientName: string, amount: number, note?: string }) => {
        const contact = CONTACTS.find(c => c.name.toLowerCase().includes(recipientName.toLowerCase()));
        if (!contact) {
            return { status: 'ERROR', message: `I'm sorry, I couldn't find "${recipientName}" in your contacts.` };
        }

        const newReceipt = {
            vendor: `Transfer to ${contact.name}`,
            vendorLogo: contact.avatarUrl,
            date: new Date().toISOString(),
            total: amount,
            category: 'Transfers',
            items: [{ name: `Transfer with note: "${note || 'No note'}"`, quantity: 1, price: amount }],
        };
        addReceiptAndNavigate(newReceipt, setActiveView, 'transactions');
        onClose(); // Close assistant after initiating transfer
        return { status: 'SUCCESS', message: `OK. I've sent ${formatCurrency(amount)} to ${contact.name}.` };
    }, [addReceiptAndNavigate, setActiveView, onClose]);

    const performCurrencyExchange = useCallback(({ amount, sourceCurrency, targetCurrency }: { amount: number, sourceCurrency: string, targetCurrency: string }) => {
        const sourceRate = EXCHANGE_RATES[sourceCurrency.toUpperCase() as keyof typeof EXCHANGE_RATES];
        const targetRate = EXCHANGE_RATES[targetCurrency.toUpperCase() as keyof typeof EXCHANGE_RATES];
        
        if (!sourceRate || !targetRate) {
            return { status: 'ERROR', message: "I'm sorry, I couldn't find exchange rates for one of those currencies. Please use standard 3-letter currency codes like USD, EUR, or SEK." };
        }

        const amountInUSD = amount / sourceRate;
        const convertedAmount = amountInUSD * targetRate;
        
        return {
            status: 'SUCCESS',
            message: `${amount} ${sourceCurrency.toUpperCase()} is approximately ${convertedAmount.toFixed(2)} ${targetCurrency.toUpperCase()}.`
        };
    }, []);


    const executeFunctionCall = useCallback(async (functionCall: any) => {
        let result;
        switch (functionCall.name) {
            case 'getAccountBalance':
                result = getAccountBalance(functionCall.args);
                break;
            case 'getRecentTransactions':
                result = getRecentTransactions(functionCall.args);
                break;
            case 'initiateTransfer':
                result = initiateTransfer(functionCall.args);
                break;
            case 'performCurrencyExchange':
                result = performCurrencyExchange(functionCall.args);
                break;
            default:
                result = { status: 'ERROR', message: `Unknown function: ${functionCall.name}` };
        }
        
        const session = await sessionPromiseRef.current;
        if (session) {
            session.sendToolResponse({
                functionResponses: {
                    id: functionCall.id,
                    name: functionCall.name,
                    response: { result: JSON.stringify(result) }
                }
            });
        }
    }, [getAccountBalance, getRecentTransactions, initiateTransfer, performCurrencyExchange]);

    const playAudio = useCallback(async (base64Audio: string) => {
        const { output: outputAudioContext, sources } = audioContextRefs.current;
        if (!outputAudioContext || !base64Audio) return;

        setStatus('SPEAKING');
        setStatusText('Thinking...');

        const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
        const source = outputAudioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(outputAudioContext.destination);
        
        const currentTime = outputAudioContext.currentTime;
        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, currentTime);
        
        source.start(nextStartTimeRef.current);
        nextStartTimeRef.current += audioBuffer.duration;
        sources.add(source);
        
        source.onended = () => {
            sources.delete(source);
            if (sources.size === 0) {
                setStatus('IDLE');
                setStatusText('Tap the orb to speak');
            }
        };
    }, []);

    const onMessage = useCallback(async (message: LiveServerMessage) => {
        if (message.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
            await playAudio(message.serverContent.modelTurn.parts[0].inlineData.data);
        }
        if (message.toolCall) {
            setStatus('PROCESSING');
            setStatusText('Accessing your information...');
            for (const fc of message.toolCall.functionCalls) {
                await executeFunctionCall(fc);
            }
        }
    }, [playAudio, executeFunctionCall]);

    const setupAudio = useCallback(async () => {
        setStatus('LISTENING');
        setStatusText('Listening...');
        if (!aiRef.current) return;
        
        audioContextRefs.current.input = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        audioContextRefs.current.output = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        
        streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        sessionPromiseRef.current = aiRef.current.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            callbacks: {
                onopen: () => {
                    const source = audioContextRefs.current.input!.createMediaStreamSource(streamRef.current!);
                    const scriptProcessor = audioContextRefs.current.input!.createScriptProcessor(4096, 1, 1);
                    scriptProcessorRef.current = scriptProcessor;

                    scriptProcessor.onaudioprocess = (e) => {
                        const inputData = e.inputBuffer.getChannelData(0);
                        const pcmBlob = createBlob(inputData);
                        sessionPromiseRef.current?.then(session => session.sendRealtimeInput({ media: pcmBlob }));
                    };
                    source.connect(scriptProcessor);
                    scriptProcessor.connect(audioContextRefs.current.input!.destination);
                },
                onmessage: onMessage,
                onerror: (e) => {
                    console.error("Session error:", e);
                    setStatus('IDLE');
                    setStatusText('Connection error. Please try again.');
                },
                onclose: () => {
                    setStatus('IDLE');
                    setStatusText('Session closed.');
                },
            },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
                tools: [{ functionDeclarations }],
                systemInstruction: getSystemInstruction()
            },
        });
    }, [onMessage]);

    const stopAudio = useCallback(async () => {
        setStatus('PROCESSING');
        setStatusText('Processing...');
        streamRef.current?.getTracks().forEach(track => track.stop());
        scriptProcessorRef.current?.disconnect();
        audioContextRefs.current.input?.close();
    }, []);

    const tearDown = useCallback(async () => {
        await stopAudio();
        const session = await sessionPromiseRef.current;
        session?.close();
        audioContextRefs.current.output?.close();
        sessionPromiseRef.current = null;
        streamRef.current = null;
        scriptProcessorRef.current = null;
    }, [stopAudio]);

    const handleOrbClick = () => {
        if (!isConfigured) return;
        if (status === 'IDLE' || status === 'PROCESSING') {
            setupAudio();
        } else if (status === 'LISTENING') {
            stopAudio();
        }
    };

    useEffect(() => {
        if (process.env.API_KEY) {
            try {
                aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
                setIsConfigured(true);
            } catch (error) {
                console.error("Failed to initialize GoogleGenAI:", error);
                setIsConfigured(false);
                setStatusText('Assistant not available.');
            }
        } else {
            setIsConfigured(false);
            setStatusText('Assistant not available.');
        }

        return () => {
            if (sessionPromiseRef.current) {
                tearDown();
            }
        };
    }, [tearDown]);

    if (!isOpen) return null;

    const getStatusStyles = () => {
        switch (status) {
            case 'LISTENING': return { orb: 'scale-110 shadow-lg shadow-yellow-400/50', ring: 'border-yellow-400/50 animate-ping', icon: 'text-yellow-300' };
            case 'PROCESSING': return { orb: 'animate-spin', ring: 'border-blue-400/50', icon: 'hidden' };
            case 'SPEAKING': return { orb: 'aurora-effect', ring: '', icon: 'text-blue-200' };
            default: return { orb: 'animate-pulse-slow', ring: 'border-gray-500/30', icon: 'text-gray-400' };
        }
    };
    const { orb, ring, icon } = getStatusStyles();

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex flex-col items-center justify-center text-white p-4" onClick={onClose}>
            <style>{`
                .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                .aurora-effect {
                    background: radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(26,54,93,0) 70%);
                    animation: aurora-pulse 2s ease-in-out infinite;
                }
                @keyframes aurora-pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.7; }
                }
            `}</style>
            <div className="text-center" onClick={e => e.stopPropagation()}>
                <button onClick={handleOrbClick} disabled={!isConfigured} className="relative w-48 h-48 rounded-full flex items-center justify-center transition-transform duration-300 ease-in-out">
                    <div className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${ring}`}></div>
                    <div className={`w-full h-full rounded-full bg-[#1a365d]/50 flex items-center justify-center transition-all duration-300 ${orb}`}>
                        <i className={`fas fa-microphone-alt text-6xl transition-colors duration-300 ${icon}`}></i>
                    </div>
                </button>
                <p className="mt-8 text-lg font-semibold h-6 transition-opacity duration-300">{statusText}</p>
            </div>
            <button onClick={onClose} className="absolute bottom-8 px-6 py-2 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20">Close</button>
        </div>
    );
};

export default LiveVoiceAssistant;