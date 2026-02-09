import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { 
  Cpu, 
  Layers, 
  Zap, 
  Microscope, 
  PenTool, 
  Box, 
  Grid, 
  Info,
  X,
  Share2,
  Atom,
  ChevronDown,
  Award,
  ArrowRight,
  BookOpen,
  GraduationCap,
  ExternalLink,
  ChevronsRight,
  Activity,
  MessageSquareText,
  Send,
  Bot,
  Sparkles
} from 'lucide-react';

// --- Types ---

interface Representative {
  name: string;
  field: string;
  intro: string; // "Big white words" / Catchy Headline
  achievement: string; // Detailed explanation
}

interface ICNode {
  id: string;
  label: string;
  subLabel: string; // The "Plain English" metaphor
  description: string;
  icon: React.ElementType;
  color: string;
  reps: Representative[];
  details: string; // Deeper explanation
}

interface Link {
  source: string;
  target: string;
  desc: string;
}

// --- Data ---

const NODES: ICNode[] = [
  {
    id: 'materials',
    label: '材料',
    subLabel: '芯片的地基',
    description: '就像盖房子的砖瓦，决定了芯片的极限性能。没有好材料，设计再精妙也造不出好芯片。',
    icon: Atom,
    color: '#ef4444', // Red-500
    reps: [
      { 
        name: '任天令', 
        field: '柔性电子',
        intro: '把芯片做成创可贴',
        achievement: '研发出了石墨烯电子皮肤，不仅能灵敏地监测心跳、呼吸，还能像皮肤一样弯曲拉伸。这让未来的电子设备可以舒适地“长”在身上，实现无感健康监测。'
      },
      { 
        name: '吴华强', 
        field: '新存储材料',
        intro: '像大脑一样的芯片',
        achievement: '基于忆阻器技术打造“存算一体”芯片，打破了传统电脑“记忆”和“计算”分离的限制（冯·诺依曼瓶颈），让计算机能像人脑一样高效、低功耗地处理信息。'
      }
    ],
    details: '半导体材料是集成电路的基石。研究重点包括：1. 硅基材料的极限突破；2. 第三代宽禁带半导体(GaN, SiC)在高频大功率场景的应用；3. 二维材料(Graphene, MoS2)在后摩尔时代的潜力。材料特性直接决定了载流子迁移率和带隙宽度。'
  },
  {
    id: 'devices',
    label: '器件与物理',
    subLabel: '纳米级的开关',
    description: '研究电子如何在材料中运动，设计出更小更快的晶体管。是连接微观原子世界和宏观电路功能的桥梁。',
    icon: Zap,
    color: '#f97316', // Orange-500
    reps: [
      { 
        name: '陈炜', 
        field: '量子器件',
        intro: '捕捉微观世界的幽灵',
        achievement: '利用量子点技术制造极微小的电子陷阱，探索量子计算的物理基础。这是通往比现有超级计算机快亿万倍的量子计算机的必经之路。'
      },
      { 
        name: '唐建石', 
        field: '类脑计算器件',
        intro: '人造神经元',
        achievement: '开发出能模拟生物突触行为的晶体管。这种器件能够通过“学习”改变自身的导电性，就像人脑神经元连接变强一样，是构建未来人工智能硬件的细胞。'
      }
    ],
    details: '器件物理聚焦于载流子输运机制。核心研究包括：FinFET/GAAFET等新型晶体管结构设计，以抑制短沟道效应；利用自旋电子学(Spintronics)和量子效应开发新型非易失性存储和逻辑器件。'
  },
  {
    id: 'process',
    label: '工艺与制造',
    subLabel: '原子级雕刻术',
    description: '利用光刻和刻蚀，在指甲盖大小的地方雕刻出百亿个电路。这是地球上最精密的制造技术。',
    icon: Microscope,
    color: '#eab308', // Yellow-500
    reps: [
      { 
        name: '高伟民', 
        field: '先进光刻',
        intro: '在头发丝上刻航母',
        achievement: '挑战物理极限，研究纳米级的光刻工艺控制。这相当于在头发丝的横截面上雕刻出一整座复杂的城市，任何微小的灰尘或震动都是灾难。'
      },
      { 
        name: '钱鹤', 
        field: '存算一体工艺',
        intro: '打破数据传输的墙',
        achievement: '将存储单元和计算单元在制造工艺上直接融合。这就像把工厂建在仓库里，省去了货物（数据）在路上运输的时间和能量，大幅提升效率。'
      }
    ],
    details: '集成电路制造工艺（Foundry）包含光刻(Lithography)、刻蚀(Etching)、沉积(Deposition)等步骤。当前挑战在于EUV光刻技术的良率提升、原子层沉积(ALD)的精准控制以及DTCO(设计与工艺协同优化)。'
  },
  {
    id: 'eda',
    label: 'EDA',
    subLabel: '设计师的大脑',
    description: '电子设计自动化软件。芯片设计太复杂了，没有这个“智能助手”，人类根本无法处理上亿个晶体管的连线。',
    icon: PenTool,
    color: '#22c55e', // Green-500
    reps: [
      { 
        name: '王燕', 
        field: 'EDA 算法',
        intro: '芯片医生的X光眼',
        achievement: '专注于寄生参数提取算法。在芯片制造前，就能通过复杂的数学模型精准预测电路中看不见的电磁干扰，确保设计图纸完美无缺。'
      },
      { 
        name: '叶佐昌', 
        field: '电路仿真',
        intro: '虚拟世界的试飞员',
        achievement: '开发高效的射频电路仿真工具。就像在电脑上模拟飞机试飞一样，让工程师能在软件里跑通高频信号，大幅缩短芯片研发周期并节省昂贵的流片成本。'
      }
    ],
    details: 'EDA是芯片设计的核心使能工具。关键技术包括：物理验证(DRC/LVS)、寄生参数提取(RC Extraction)、布局布线(Place & Route)算法以及基于AI的敏捷设计方法学。'
  },
  {
    id: 'design',
    label: 'IC 设计',
    subLabel: '逻辑与信号交响乐',
    description: '将功能需求转化为具体的电路图，指挥电流完成计算。就像建筑师画图纸，决定了芯片能做什么。',
    icon: Cpu,
    color: '#06b6d4', // Cyan-500
    reps: [
      { 
        name: '魏少军', 
        field: '可重构计算',
        intro: '让芯片像变形金刚一样思考',
        achievement: '提出的“软件定义芯片”架构，让芯片内部电路能随软件需求实时重构。同一块芯片既能处理图像，又能加密数据，实现了通用性与高能效的完美结合。'
      },
      { 
        name: '王志华', 
        field: '射频通信',
        intro: '体内的健康卫士',
        achievement: '设计超低功耗的医疗植入芯片。例如植入式胶囊内镜芯片，能在人体内无线传输高清图像，且功耗极低，不需要大电池，守护人类健康。'
      }
    ],
    details: 'IC设计涵盖数字前端（RTL设计、功能验证）、数字后端（物理实现）及模拟/射频设计。重点在于PPA(性能、功耗、面积)的极致优化，以及针对特定应用场景（如AI、5G）的架构创新。'
  },
  {
    id: 'packaging',
    label: '封装与测试',
    subLabel: '铠甲与神经网络',
    description: '保护脆弱的芯片，并接通它与外部世界的电路。现在的封装还能把多个芯片“缝”在一起，变得更强。',
    icon: Box,
    color: '#8b5cf6', // Violet-500
    reps: [
      { 
        name: '王喆垚', 
        field: '3D 封装/MEMS',
        intro: '芯片世界的搭积木',
        achievement: '研究微机电系统(MEMS)与集成电路的3D集成。把微小的传感器（听觉、触觉）和处理器垂直堆叠在一起，让芯片不仅能计算，还能“感知”世界。'
      }
    ],
    details: '先进封装技术(Advanced Packaging)正成为延续摩尔定律的关键。通过TSV(硅通孔)、RDL(重布线层)和微凸点技术，实现异构芯片的2.5D/3D堆叠(Chiplet)，大幅提升I/O密度和系统性能。'
  },
  {
    id: 'soc',
    label: 'SoC',
    subLabel: '超级集成体',
    description: '片上系统。把CPU、显卡、AI引擎等所有功能都塞进一颗芯片里，是手机和电脑的心脏。',
    icon: Grid,
    color: '#ec4899', // Pink-500
    reps: [
      { 
        name: '尹首一', 
        field: 'AI 系统芯片',
        intro: '让万物都有智能',
        achievement: '专注于高能效AI芯片设计。让智能手环、摄像头等电池供电的小设备，也能运行复杂的人工智能算法，实现真正的万物互联智能。'
      }
    ],
    details: 'SoC (System on Chip) 设计是多学科交叉的系统工程。它涉及软硬件协同设计(Co-design)、片上网络(NoC)架构、电源管理以及复杂的IP核复用技术，旨在实现系统级的高能效计算。'
  }
];

// Workflow order for visualization
const WORKFLOW_ORDER = ['materials', 'devices', 'process', 'eda', 'design', 'packaging', 'soc'];

// Complex mesh of dependencies
const LINKS: Link[] = [
  { source: 'materials', target: 'devices', desc: '材料特性决定器件理论极限' },
  { source: 'devices', target: 'process', desc: '新器件结构依赖新工艺实现' },
  { source: 'process', target: 'eda', desc: '工艺参数(PDK)传递给EDA工具' },
  { source: 'eda', target: 'design', desc: 'EDA是实现复杂设计的必备工具' },
  { source: 'design', target: 'soc', desc: 'SoC是多种功能IP设计的集合体' },
  { source: 'process', target: 'packaging', desc: '晶圆制造完成后进入封测环节' },
  { source: 'packaging', target: 'soc', desc: '先进封装实现SoC的高密度互联' },
  { source: 'design', target: 'process', desc: '设计版图需符合工艺设计规则(DRC)' },
  { source: 'materials', target: 'process', desc: '新材料引入需要开发新工艺流程' },
  { source: 'eda', target: 'soc', desc: '系统级验证工具保障SoC良率' },
];

// --- Helpers ---

const CENTER = { x: 50, y: 50 }; // Percentage
const RADIUS = 35; // Percentage

function getNodePosition(index: number, total: number) {
  // Start from -90deg (12 o'clock)
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  const x = CENTER.x + RADIUS * Math.cos(angle);
  const y = CENTER.y + RADIUS * Math.sin(angle);
  return { x, y, angle };
}

// --- Components ---

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: '你好！我是你的专属 IC 导师。👋 \n无论是芯片的奥秘，还是清华大学的科研方向，随时问我！我会用最通俗的语言为你解答。' }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatSessionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  useEffect(() => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chatSessionRef.current = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "你是一位拥有10年经验的清华大学集成电路（IC）专家和教授。你的受众是高中生和大学新生。请用通俗易懂、生动有趣的语言（比如比喻）解释芯片知识。你可以回答关于材料、器件、工艺、EDA、设计、封测、SoC等领域的问题。你的目标是激发学生对芯片行业的兴趣。语气：亲切、鼓励、专业但平易近人。如果遇到过于深奥的问题，先用简单的概念解释，再提供深入的知识点。你可以使用 emoji 来活跃气氛。",
      },
    });
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsThinking(true);

    try {
      // Optimistically add an empty model message for streaming
      setMessages(prev => [...prev, { role: 'model', text: '' }]);
      
      const result = await chatSessionRef.current.sendMessageStream({ message: userMsg });
      
      let fullText = '';
      for await (const chunk of result) {
        const text = (chunk as GenerateContentResponse).text;
        if (text) {
          fullText += text;
          setMessages(prev => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1].text = fullText;
            return newHistory;
          });
        }
      }
    } catch (e) {
      console.error("Chat Error:", e);
      setMessages(prev => [...prev, { role: 'model', text: '抱歉，我的连接似乎断开了，请稍后再试。' }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-neon-blue text-black shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:scale-110 transition-transform duration-300 group"
      >
        {isOpen ? <X size={24} /> : <Bot size={24} className="group-hover:animate-bounce" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[500px] bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-slate-950/50 border-b border-slate-800 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <div>
                <h3 className="text-white font-bold text-sm">AI Lab Assistant</h3>
                <p className="text-[10px] text-slate-400 font-mono">POWERED BY GEMINI</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`
                      max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                      ${msg.role === 'user' 
                        ? 'bg-neon-blue text-black rounded-tr-none font-medium' 
                        : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'}
                    `}
                  >
                    {msg.role === 'model' && msg.text === '' && isThinking ? (
                      <div className="flex gap-1 items-center h-5">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100" />
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200" />
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/30">
               <div className="relative flex items-center">
                 <input 
                   type="text" 
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyDown={handleKeyDown}
                   placeholder="Ask about IC design..."
                   className="w-full bg-slate-900 border border-slate-700 rounded-full py-3 pl-4 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-neon-blue transition-colors"
                 />
                 <button 
                   onClick={handleSend}
                   disabled={!input.trim() || isThinking}
                   className="absolute right-2 p-2 rounded-full bg-slate-800 text-neon-blue hover:bg-neon-blue hover:text-black transition-colors disabled:opacity-50 disabled:hover:bg-slate-800 disabled:hover:text-neon-blue"
                 >
                   {isThinking ? <Activity size={16} className="animate-spin" /> : <Send size={16} />}
                 </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

interface ConnectionLinesProps { 
  hoveredNode: string | null;
  selectedNode: string | null;
}

const ConnectionLines: React.FC<ConnectionLinesProps> = ({ 
  hoveredNode, 
  selectedNode 
}) => {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#020617" stopOpacity="0" />
          <stop offset="50%" stopColor="#00f3ff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0" />
        </linearGradient>
      </defs>
      {LINKS.map((link, i) => {
        const sourceIdx = NODES.findIndex(n => n.id === link.source);
        const targetIdx = NODES.findIndex(n => n.id === link.target);
        const sourcePos = getNodePosition(sourceIdx, NODES.length);
        const targetPos = getNodePosition(targetIdx, NODES.length);

        const isHighlighted = 
          hoveredNode === link.source || 
          hoveredNode === link.target || 
          selectedNode === link.source ||
          selectedNode === link.target;

        return (
          <motion.g key={`${link.source}-${link.target}`}>
            <motion.line
              x1={`${sourcePos.x}%`}
              y1={`${sourcePos.y}%`}
              x2={`${targetPos.x}%`}
              y2={`${targetPos.y}%`}
              stroke={isHighlighted ? "#00f3ff" : "#1e293b"}
              strokeWidth={isHighlighted ? 2 : 1}
              strokeOpacity={isHighlighted ? 0.8 : 0.2}
              initial={false}
              animate={{
                stroke: isHighlighted ? "#00f3ff" : "#1e293b",
                strokeOpacity: isHighlighted ? 0.8 : 0.2,
                strokeWidth: isHighlighted ? 2 : 1
              }}
              filter={isHighlighted ? "url(#glow)" : undefined}
            />
            {isHighlighted && (
              <circle r="3" fill="#00ff9d">
                <animateMotion 
                  dur="1.5s" 
                  repeatCount="indefinite"
                  path={`M ${sourcePos.x * window.innerWidth / 100} ${sourcePos.y * window.innerHeight / 100} L ${targetPos.x * window.innerWidth / 100} ${targetPos.y * window.innerHeight / 100}`}
                />
              </circle>
            )}
          </motion.g>
        );
      })}
    </svg>
  );
};

interface NodeItemProps { 
  node: ICNode;
  index: number; 
  total: number;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
  isDimmed: boolean;
}

const NodeItem: React.FC<NodeItemProps> = ({ 
  node, 
  index, 
  total, 
  onHover, 
  onSelect, 
  isSelected, 
  isDimmed 
}) => {
  const { x, y } = getNodePosition(index, total);

  return (
    <motion.div
      className={`absolute flex flex-col items-center justify-center cursor-pointer transition-all duration-500 z-10 w-32 h-32 -ml-16 -mt-16`}
      style={{ left: `${x}%`, top: `${y}%` }}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(node.id)}
      animate={{
        scale: isSelected ? 1.2 : isDimmed ? 0.8 : 1,
        opacity: isDimmed ? 0.3 : 1,
      }}
    >
      <div 
        className={`absolute inset-0 rounded-full border border-dashed transition-all duration-500 ${isSelected ? 'animate-spin-slow border-neon-blue opacity-100' : 'border-slate-700 opacity-30'}`}
        style={{ width: '140%', height: '140%', left: '-20%', top: '-20%' }}
      />

      <div 
        className={`
          relative w-20 h-20 rounded-2xl flex items-center justify-center 
          backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)] border
          transition-colors duration-300 group
        `}
        style={{ 
          backgroundColor: isSelected ? 'rgba(0, 243, 255, 0.1)' : 'rgba(15, 23, 42, 0.6)',
          borderColor: isSelected ? node.color : 'rgba(148, 163, 184, 0.2)'
        }}
      >
        <node.icon 
          size={32} 
          style={{ color: isSelected ? '#fff' : node.color }} 
          className="transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute -top-1 w-2 h-2 bg-slate-600 rounded-full" />
        <div className="absolute -bottom-1 w-2 h-2 bg-slate-600 rounded-full" />
      </div>

      <div className="mt-4 text-center">
        <h3 className={`font-bold text-sm tracking-wider ${isSelected ? 'text-neon-blue' : 'text-slate-200'}`}>
          {node.label}
        </h3>
        <p className="text-[10px] text-slate-400 font-mono mt-1 opacity-80 uppercase">
          {node.subLabel}
        </p>
      </div>
    </motion.div>
  );
};

interface ProfessorCardProps {
  rep: Representative;
  color: string;
}

const ProfessorCard: React.FC<ProfessorCardProps> = ({ rep, color }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      layout 
      onClick={() => setIsOpen(!isOpen)}
      className={`
        relative overflow-hidden rounded-lg border cursor-pointer transition-all duration-300 group
        ${isOpen ? 'bg-slate-800 border-neon-blue ring-1 ring-neon-blue/50' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'}
      `}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded bg-slate-900/50 ${isOpen ? 'text-neon-blue' : 'text-slate-400 group-hover:text-white'}`}>
             <Award size={20} />
          </div>
          <div>
            <h4 className={`font-bold text-base transition-colors ${isOpen ? 'text-neon-blue' : 'text-slate-200 group-hover:text-white'}`}>
              {rep.name}
            </h4>
            <span className="text-xs font-mono text-slate-400">
              {rep.field}
            </span>
          </div>
        </div>
        <motion.div 
          animate={{ rotate: isOpen ? 180 : 0 }}
          className={`transition-colors ${isOpen ? 'text-neon-blue' : 'text-slate-500 group-hover:text-slate-300'}`}
        >
          <ChevronDown size={20} />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden bg-slate-900/80"
          >
            <div className="p-4 pt-0 border-t border-slate-700/50">
               <div className="mt-4">
                 <div className="flex items-center gap-2 mb-2">
                   <span className="inline-block px-2 py-0.5 text-[10px] font-bold text-black bg-neon-green rounded-sm tracking-wider uppercase">
                     Core Tech
                   </span>
                 </div>
                 
                 <p className="text-xl font-bold text-white mb-3 leading-tight tracking-tight">
                   {rep.intro}
                 </p>
                 
                 <div className="text-sm text-slate-300 leading-relaxed space-y-2 border-l-2 border-slate-700 pl-3">
                   <p>{rep.achievement}</p>
                 </div>

                 <button className="mt-4 flex items-center gap-2 text-xs font-mono text-neon-blue hover:text-white transition-colors border border-neon-blue/30 hover:bg-neon-blue/10 px-3 py-2 rounded">
                    <ExternalLink size={12} />
                    VISIT LAB
                 </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

interface DetailPanelProps { 
  node: ICNode;
  onClose: () => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ node, onClose }) => {
  const [isProMode, setIsProMode] = useState(false);

  // Filter links related to this node
  const relatedLinks = LINKS.filter(l => l.source === node.id || l.target === node.id);

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute top-0 right-0 h-full w-full md:w-[60%] bg-slate-900/95 backdrop-blur-2xl border-l border-slate-700 z-50 shadow-2xl flex flex-col"
    >
      {/* 1. Navigation / Breadcrumbs */}
      <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="hover:text-neon-blue cursor-pointer" onClick={onClose}>GALAXY CENTER</span>
          <ChevronsRight size={12} />
          <span className="text-neon-blue">{node.id.toUpperCase()}</span>
          <ChevronsRight size={12} />
          <span className="text-slate-500">{isProMode ? 'PRO_VIEW' : 'BASIC_VIEW'}</span>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pb-20">
        
        {/* 2. Workflow Visualization (Time-series) */}
        <div className="mb-8">
           <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
             <Activity size={12} /> 产业链全景定位
           </h3>
           <div className="flex items-center justify-between relative px-2">
              {/* Connector Line */}
              <div className="absolute left-0 top-1/2 w-full h-0.5 bg-slate-800 -z-0" />
              
              {WORKFLOW_ORDER.map((stepId, idx) => {
                const isActive = stepId === node.id;
                const isPast = WORKFLOW_ORDER.indexOf(stepId) < WORKFLOW_ORDER.indexOf(node.id);
                const stepNode = NODES.find(n => n.id === stepId);

                return (
                  <div key={stepId} className="relative z-10 flex flex-col items-center gap-2 group">
                    <div 
                      className={`
                        w-3 h-3 rounded-full border-2 transition-all duration-300
                        ${isActive ? 'bg-neon-blue border-neon-blue scale-125 shadow-[0_0_10px_#00f3ff]' : 
                          isPast ? 'bg-slate-700 border-slate-600' : 'bg-slate-900 border-slate-700'}
                      `} 
                    />
                    <span className={`text-[9px] font-mono uppercase tracking-wider absolute top-4 whitespace-nowrap ${isActive ? 'text-neon-blue font-bold' : 'text-slate-600'}`}>
                      {stepNode?.label}
                    </span>
                  </div>
                )
              })}
           </div>
        </div>

        {/* Header Area with Icon and Toggle */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 mt-6">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-600 shadow-lg shadow-black/50">
              <node.icon size={48} style={{ color: node.color }} />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white tracking-tight">{node.label}</h2>
              <p className="text-slate-400 text-sm mt-1">{node.subLabel}</p>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
             <button 
               onClick={() => setIsProMode(false)}
               className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${!isProMode ? 'bg-neon-green text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
             >
               😀 科普模式
             </button>
             <button 
               onClick={() => setIsProMode(true)}
               className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${isProMode ? 'bg-neon-blue text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
             >
               🤓 专业模式
             </button>
          </div>
        </div>

        {/* 3. Main Content: Pop vs Pro */}
        <div className="grid gap-8">
          <section className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               {isProMode ? <GraduationCap size={100} /> : <BookOpen size={100} />}
            </div>
            
            <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${isProMode ? 'text-neon-blue' : 'text-neon-green'}`}>
               {isProMode ? 'TECHNICAL DEEP DIVE' : 'PLAIN ENGLISH INTRO'}
            </h3>
            
            <AnimatePresence mode='wait'>
              <motion.div
                key={isProMode ? 'pro' : 'pop'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {isProMode ? (
                  <div className="prose prose-invert max-w-none">
                    <p className="text-slate-300 leading-7 text-sm text-justify font-light">
                      {node.details}
                    </p>
                    {/* Add some fake technical specs for visuals */}
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono text-slate-400">
                       <div className="bg-slate-900/50 p-2 rounded">T-NODE: 3nm/2nm</div>
                       <div className="bg-slate-900/50 p-2 rounded">POWER: &lt;1W</div>
                       <div className="bg-slate-900/50 p-2 rounded">FREQ: &gt;3.5GHz</div>
                       <div className="bg-slate-900/50 p-2 rounded">DENSITY: 200MTr/mm²</div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-xl text-white font-medium leading-relaxed mb-4">
                      "{node.subLabel}"
                    </p>
                    <p className="text-slate-300 leading-relaxed text-base">
                      {node.description}
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </section>

          {/* 4. Cross-Domain Logic (Dependencies) */}
          <section>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Share2 size={12} /> 领域交错与协作
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
               {relatedLinks.map((link, idx) => {
                 const isSource = link.source === node.id;
                 const otherNode = NODES.find(n => n.id === (isSource ? link.target : link.source));
                 
                 return (
                   <div key={idx} className="p-3 rounded bg-slate-800/50 border border-slate-700 hover:border-slate-500 transition-colors flex flex-col gap-2">
                     <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                        {isSource ? (
                          <>
                            <span className="text-neon-blue">OUTPUT</span>
                            <ArrowRight size={10} />
                            <span>{otherNode?.label}</span>
                          </>
                        ) : (
                          <>
                            <span className="text-amber-400">INPUT</span>
                            <ArrowRight size={10} />
                            <span>From {otherNode?.label}</span>
                          </>
                        )}
                     </div>
                     <p className="text-sm text-slate-200">
                       {link.desc}
                     </p>
                   </div>
                 )
               })}
            </div>
          </section>

          {/* 5. Professors & Labs */}
          <section>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
              清华实验室动态
            </h3>
            <div className="grid gap-3">
              {node.reps.map((rep, idx) => (
                <ProfessorCard key={idx} rep={rep} color={node.color} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Application ---

const App = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const selectedNode = useMemo(
    () => NODES.find(n => n.id === selectedNodeId),
    [selectedNodeId]
  );

  return (
    <div className="relative w-full h-screen bg-space overflow-hidden font-sans selection:bg-neon-blue selection:text-black">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Decorative Grid */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', 
          backgroundSize: '50px 50px' 
        }} 
      />

      {/* Header / HUD */}
      <header className="absolute top-6 left-6 z-40 pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse-fast shadow-[0_0_10px_#00ff9d]" />
          <h1 className="text-2xl font-bold tracking-widest text-white">
            IC GALAXY <span className="text-neon-blue text-sm align-top opacity-80">v2.0</span>
          </h1>
        </div>
        <p className="text-slate-400 text-xs font-mono mt-1 tracking-wider ml-6">
          INTEGRATED CIRCUIT KNOWLEDGE GRAPH
        </p>
      </header>

      {/* Main Interactive Area */}
      <main className="relative w-full h-full flex items-center justify-center">
        
        {/* Galaxy Container */}
        {/* Adjusted Layout Logic: Moves left and scales down when selected */}
        <motion.div 
          className="relative w-[90vmin] h-[90vmin] md:w-[70vmin] md:h-[70vmin]"
          animate={{
            x: selectedNodeId ? '-25%' : '0%',
            scale: selectedNodeId ? 0.75 : 1,
            opacity: selectedNodeId ? 0.8 : 1
          }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          
          {/* Central Core Decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-slate-900/50 rounded-full border border-slate-800 backdrop-blur-sm flex items-center justify-center z-0">
             <div className="text-center opacity-40">
                <div className="text-xs font-mono text-neon-blue mb-1">CORE</div>
                <div className="text-3xl font-bold tracking-tighter text-white">CHIP</div>
             </div>
             {/* Spinning Rings */}
             <div className="absolute inset-0 border border-slate-800 rounded-full animate-spin-slow opacity-30" style={{ borderStyle: 'dashed' }} />
             <div className="absolute inset-2 border border-slate-700/30 rounded-full animate-spin-slow opacity-30" style={{ animationDirection: 'reverse', animationDuration: '40s' }} />
          </div>

          <ConnectionLines 
            hoveredNode={hoveredNodeId} 
            selectedNode={selectedNodeId} 
          />

          {NODES.map((node, index) => (
            <NodeItem
              key={node.id}
              node={node}
              index={index}
              total={NODES.length}
              onHover={setHoveredNodeId}
              onSelect={setSelectedNodeId}
              isSelected={selectedNodeId === node.id}
              isDimmed={!!selectedNodeId && selectedNodeId !== node.id}
            />
          ))}

        </motion.div>
      </main>

      {/* Detail Sidebar */}
      <AnimatePresence>
        {selectedNode && (
          <DetailPanel 
            node={selectedNode} 
            onClose={() => setSelectedNodeId(null)} 
          />
        )}
      </AnimatePresence>

      {/* Footer Hints */}
      {!selectedNodeId && (
        <div className="absolute bottom-6 left-6 text-slate-500 text-xs font-mono pointer-events-none">
          <p>HOVER TO REVEAL DEPENDENCIES</p>
          <p>CLICK NODES FOR DATA ANALYSIS</p>
        </div>
      )}

      {/* AI Assistant Chat */}
      <ChatWidget />

    </div>
  );
};

export default App;