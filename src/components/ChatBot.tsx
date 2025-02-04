import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Heart, Loader } from 'lucide-react';

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
  error?: boolean;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm your health assistant, here to help you with medical information and guidance. To better assist you, please provide:\n\n" +
            "• Your main symptoms\n" +
            "• How long you've had them\n" +
            "• Severity (mild/moderate/severe)\n\n" +
            "You can ask about conditions like:\n" +
            "• Different types of fever\n" +
            "• Common diseases\n" +
            "• Chronic conditions\n" +
            "• Lifestyle diseases\n\n" +
            "Remember: This is not a substitute for professional medical advice. Always consult a healthcare provider for proper diagnosis and treatment.",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const botResponse = getBotResponse(input);
      
      setMessages((prev) => [
        ...prev,
        {
          text: botResponse,
          isBot: true,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: "I apologize, but I'm having trouble processing your request. Could you please rephrase your question?",
          isBot: true,
          timestamp: new Date(),
          error: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Enhanced disease information
    const diseases = {
      diabetes: {
        name: "Diabetes",
        symptoms: "• Increased thirst and urination\n• Extreme hunger\n• Unexplained weight loss\n• Fatigue\n• Blurred vision\n• Slow-healing sores",
        warning_signs: "• Blood sugar > 240 mg/dL\n• Ketones in urine\n• Rapid breathing\n• Fruity breath odor\n• Confusion\n• Extreme fatigue",
        management: "• Regular blood sugar monitoring\n• Insulin or medication as prescribed\n• Regular exercise\n• Proper foot care\n• Regular medical check-ups",
        diet: "• Low glycemic index foods\n• High-fiber vegetables\n• Lean proteins\n• Whole grains\n• Limited sugary foods and drinks"
      },
      hypertension: {
        name: "Hypertension (High Blood Pressure)",
        symptoms: "• Headaches\n• Shortness of breath\n• Nosebleeds\n• Chest pain\n• Vision problems\n• Dizziness",
        warning_signs: "• BP > 180/120 mmHg\n• Severe headache\n• Chest pain\n• Vision problems\n• Difficulty speaking",
        management: "• Regular BP monitoring\n• Prescribed medications\n• Stress management\n• Regular exercise\n• Weight management",
        diet: "• Low sodium foods\n• DASH diet principles\n• Potassium-rich foods\n• Limited alcohol\n• Reduced caffeine"
      },
      asthma: {
        name: "Asthma",
        symptoms: "• Wheezing\n• Shortness of breath\n• Chest tightness\n• Persistent coughing\n• Difficulty sleeping",
        warning_signs: "• Severe breathlessness\n• Rapid breathing\n• Unable to speak in full sentences\n• Blue lips or fingers\n• Peak flow < 50% of best",
        management: "• Proper inhaler technique\n• Avoiding triggers\n• Following action plan\n• Regular check-ups\n• Keep rescue inhaler handy",
        diet: "• Anti-inflammatory foods\n• Vitamin D rich foods\n• Omega-3 fatty acids\n• Fresh fruits and vegetables"
      }
    };

    // Check for specific diseases
    for (const [disease, info] of Object.entries(diseases)) {
      if (input.includes(disease)) {
        return `I understand you're asking about ${info.name}. Let me provide you with comprehensive information:\n\n` +
               `Common Symptoms:\n${info.symptoms}\n\n` +
               `⚠️ Warning Signs (Seek immediate medical care):\n${info.warning_signs}\n\n` +
               `Management Strategies:\n${info.management}\n\n` +
               `Recommended Diet:\n${info.diet}\n\n` +
               `IMPORTANT: This information is for educational purposes only. Please consult a healthcare provider for proper diagnosis and treatment.`;
      }
    }
    
    // Enhanced fever types information
    if (input.includes('fever') || input.includes('temperature')) {
      if (input.includes('dengue') || (input.includes('joint') && input.includes('rash'))) {
        return "I notice you're describing symptoms that could be consistent with Dengue Fever. Here's what you should know:\n\n" +
               "Typical Symptoms:\n" +
               "• High fever (40°C/104°F)\n" +
               "• Severe headache\n" +
               "• Joint and muscle pain\n" +
               "• Characteristic rash\n" +
               "• Eye pain\n\n" +
               "⚠️ Warning Signs (Require Immediate Medical Care):\n" +
               "• Severe abdominal pain\n" +
               "• Persistent vomiting\n" +
               "• Bleeding gums or nose\n" +
               "• Extreme fatigue\n" +
               "• Rapid breathing\n\n" +
               "Home Management:\n" +
               "• Rest and hydration\n" +
               "• Acetaminophen for fever (avoid aspirin)\n" +
               "• Monitor temperature\n" +
               "• Use mosquito protection\n\n" +
               "IMPORTANT: Please seek immediate medical attention as Dengue can be serious.";
      }

      if (input.includes('typhoid') || (input.includes('stomach') && input.includes('headache'))) {
        return "Based on your symptoms, I should inform you about Typhoid Fever:\n\n" +
               "Key Symptoms:\n" +
               "• Gradually increasing fever\n" +
               "• Severe headache\n" +
               "• Stomach pain\n" +
               "• Loss of appetite\n" +
               "• Weakness\n\n" +
               "⚠️ Serious Signs:\n" +
               "• Very high fever (103°F-104°F)\n" +
               "• Severe abdominal pain\n" +
               "• Mental confusion\n" +
               "• Intestinal bleeding\n\n" +
               "Required Actions:\n" +
               "• Seek medical attention immediately\n" +
               "• Complete prescribed antibiotics\n" +
               "• Stay hydrated\n" +
               "• Rest completely\n\n" +
               "Prevention:\n" +
               "• Safe drinking water\n" +
               "• Proper hand hygiene\n" +
               "• Fully cooked foods\n" +
               "• Avoid raw vegetables\n\n" +
               "CRITICAL: Typhoid requires proper medical diagnosis and treatment.";
      }

      if (input.includes('malaria') || (input.includes('chills') && input.includes('sweat'))) {
        return "Your symptoms suggest possible Malaria. Here's important information:\n\n" +
               "Classic Symptoms:\n" +
               "• Cyclical fever and chills\n" +
               "• Profuse sweating\n" +
               "• Fatigue and weakness\n" +
               "• Headache\n" +
               "• Muscle aches\n\n" +
               "⚠️ Emergency Signs:\n" +
               "• Confusion or seizures\n" +
               "• Difficulty breathing\n" +
               "• Severe weakness\n" +
               "• Jaundice\n" +
               "• Dark or reduced urine\n\n" +
               "Required Actions:\n" +
               "• Seek immediate medical care\n" +
               "• Complete prescribed medication\n" +
               "• Rest completely\n" +
               "• Stay hydrated\n\n" +
               "Prevention:\n" +
               "• Use mosquito nets\n" +
               "• Apply insect repellent\n" +
               "• Wear protective clothing\n" +
               "• Take prophylactic medication if prescribed\n\n" +
               "URGENT: Malaria requires immediate medical attention for proper diagnosis and treatment.";
      }

      if (input.includes('viral') || (input.includes('cold') && input.includes('body ache'))) {
        return "It sounds like you might have a Viral Fever. Let me provide some guidance:\n\n" +
               "Common Symptoms:\n" +
               "• Fever (100°F-102°F)\n" +
               "• Body aches\n" +
               "• Fatigue\n" +
               "• Headache\n" +
               "• Mild cough or sore throat\n\n" +
               "Home Management:\n" +
               "• Rest adequately\n" +
               "• Stay hydrated\n" +
               "• Take acetaminophen for fever\n" +
               "• Warm compress for body aches\n" +
               "• Light, nutritious diet\n\n" +
               "When to See a Doctor:\n" +
               "• Fever above 103°F\n" +
               "• Symptoms lasting > 5 days\n" +
               "• Severe throat pain\n" +
               "• Difficulty breathing\n\n" +
               "Prevention:\n" +
               "• Regular hand washing\n" +
               "• Good sleep habits\n" +
               "• Balanced nutrition\n" +
               "• Avoid close contact with sick people";
      }
    }

    if (input.includes('exercise') || input.includes('activity')) {
      return "I'd be happy to provide exercise recommendations for better health:\n\n" +
             "Recommended Activities:\n" +
             "• Walking (30 mins daily)\n" +
             "• Swimming (2-3 times/week)\n" +
             "• Yoga or gentle stretching\n" +
             "• Cycling\n" +
             "• Light resistance training\n\n" +
             "Important Guidelines:\n" +
             "• Start gradually\n" +
             "• Listen to your body\n" +
             "• Stay well hydrated\n" +
             "• Proper warm-up/cool-down\n" +
             "• Regular rest days\n\n" +
             "⚠️ Stop exercising if you experience:\n" +
             "• Chest pain or pressure\n" +
             "• Severe shortness of breath\n" +
             "• Dizziness or lightheadedness\n" +
             "• Unusual fatigue\n\n" +
             "Remember: Please consult your healthcare provider before starting any new exercise program.";
    }

    if (input.includes('diet') || input.includes('nutrition') || input.includes('food')) {
      return "I'll help you understand healthy dietary guidelines:\n\n" +
             "Essential Components:\n" +
             "• Lean proteins (fish, poultry, legumes)\n" +
             "• Whole grains (quinoa, brown rice, oats)\n" +
             "• Fresh fruits and vegetables\n" +
             "• Healthy fats (avocado, nuts, olive oil)\n\n" +
             "Immune-Boosting Foods:\n" +
             "• Citrus fruits (vitamin C)\n" +
             "• Leafy greens (antioxidants)\n" +
             "• Yogurt (probiotics)\n" +
             "• Nuts and seeds (zinc, vitamin E)\n" +
             "• Berries (antioxidants)\n\n" +
             "Hydration Guidelines:\n" +
             "• 8-10 glasses of water daily\n" +
             "• Herbal teas\n" +
             "• Fresh fruit juices\n" +
             "• Coconut water\n\n" +
             "Foods to Limit:\n" +
             "• Processed foods\n" +
             "• Added sugars\n" +
             "• Excessive salt\n" +
             "• Saturated fats\n" +
             "• Artificial additives";
    }

    return "I'm here to help! To provide better assistance, please let me know:\n\n" +
           "1. What specific symptoms are you experiencing?\n" +
           "2. How long have you had these symptoms?\n" +
           "3. How severe are they?\n\n" +
           "You can ask about:\n" +
           "• Different types of fever (Viral, Dengue, Typhoid, Malaria)\n" +
           "• Common diseases (Diabetes, Hypertension, Asthma)\n" +
           "• Exercise recommendations\n" +
           "• Dietary guidelines\n\n" +
           "I'm here to provide information and guidance, but remember that this is not a substitute for professional medical advice.";
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-80 md:w-96 flex flex-col h-[500px]">
          <div className="p-4 bg-gradient-to-r from-sky-400 to-blue-500 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2 text-white">
              <Heart className="w-5 h-5" />
              <h3 className="font-semibold">Health Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isBot
                      ? message.error 
                        ? 'bg-red-50 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                      : 'bg-gradient-to-r from-sky-400 to-blue-500 text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSend} className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your symptoms or ask a health question..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className={`p-2 bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-lg transition-colors ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-sky-500 hover:to-blue-600'
                }`}
              >
                {isLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-sky-400 to-blue-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <Heart className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}