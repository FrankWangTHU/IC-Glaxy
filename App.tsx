import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Award
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
    description: '就像盖房子的砖瓦，决定了芯片的极限性能。',
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
    details: '半导体材料是集成电路的基石。从传统的硅(Si)到第三代半导体(GaN, SiC)，再到二维材料(Graphene)，材料科学的突破往往引领着芯片性能的代际飞跃。'
  },
  {
    id: 'devices',
    label: '器件与物理',
    subLabel: '纳米级的开关',
    description: '研究电子如何在材料中运动，设计出更小更快的晶体管。',
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
    details: '器件物理研究电子在微观尺度的行为。这包括传统的MOSFET晶体管优化，以及超越摩尔定律的新型器件，如量子点、自旋电子器件和神经形态器件。'
  },
  {
    id: 'process',
    label: '工艺与制造',
    subLabel: '原子级雕刻术',
    description: '利用光刻和刻蚀，在指甲盖大小的地方雕刻出百亿个电路。',
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
    details: '制造工艺是将设计图纸变为实物的过程。包含光刻、刻蚀、薄膜沉积、掺杂等数百道工序。这是人类精密制造的巅峰，误差容忍度以原子为单位。'
  },
  {
    id: 'eda',
    label: 'EDA',
    subLabel: '设计师的大脑',
    description: '电子设计自动化软件，没有它，人类无法手工画出亿级晶体管。',
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
    details: 'EDA (Electronic Design Automation) 是芯片设计的CAD工具。它涵盖了从功能定义、逻辑综合、布局布线到物理验证的全流程，是芯片产业的“摇篮”。'
  },
  {
    id: 'design',
    label: 'IC 设计',
    subLabel: '逻辑与信号交响乐',
    description: '将功能需求转化为具体的电路图，指挥电流完成计算。',
    icon: Cpu,
    color: '#06b6d4', // Cyan-500
    reps: [
      { 
        name: '魏少军', 
        field: '可重构计算',
        intro: '像变形金刚一样的芯片',
        achievement: '提出了“软件定义芯片”架构。芯片内部的电路连接可以根据软件需求实时动态重构，同一块芯片既能处理图像，又能加密数据，灵活多变。'
      },
      { 
        name: '王志华', 
        field: '射频通信',
        intro: '体内的健康卫士',
        achievement: '设计超低功耗的医疗植入芯片。例如植入式胶囊内镜芯片，能在人体内无线传输高清图像，且功耗极低，不需要大电池，守护人类健康。'
      }
    ],
    details: 'IC设计分为数字设计（逻辑、CPU/GPU）和模拟设计（射频、电源管理）。设计师就像建筑师，规划着庞大的晶体管城市，确保信号在纳秒级时间内准确传输。'
  },
  {
    id: 'packaging',
    label: '封装与测试',
    subLabel: '铠甲与神经网络',
    description: '保护脆弱的芯片，并接通它与外部世界的电路，同时剔除坏品。',
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
    details: '封装不仅是保护，更是性能的关键。先进封装（如2.5D/3D封装、Chiplet）允许将不同工艺的芯片堆叠在一起，突破单一芯片的面积和良率限制。'
  },
  {
    id: 'soc',
    label: 'SoC',
    subLabel: '超级集成体',
    description: '片上系统。将CPU、GPU、AI核等所有功能塞进一颗芯片里。',
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
    details: 'SoC (System on Chip) 是现代电子设备的核心。它强调异构计算，通过软硬件协同优化，在功耗和性能之间找到最佳平衡，广泛应用于手机、汽车和服务器。'
  }
];

// Complex mesh of dependencies
const LINKS: Link[] = [
  { source: 'materials', target: 'devices', desc: '材料决定器件极限' },
  { source: 'devices', target: 'process', desc: '器件结构依赖工艺实现' },
  { source: 'process', target: 'eda', desc: '工艺参数通过 PDK 传给 EDA' },
  { source: 'eda', target: 'design', desc: 'EDA 是设计的必备工具' },
  { source: 'design', target: 'soc', desc: 'SoC 是复杂设计的集合体' },
  { source: 'process', target: 'packaging', desc: '晶圆制造后进入封测' },
  { source: 'packaging', target: 'soc', desc: '先进封装赋能 SoC 互联' },
  { source: 'design', target: 'process', desc: '设计需符合工艺规则(DRC)' },
  { source: 'materials', target: 'process', desc: '新材料需要新工艺流程' },
  { source: 'eda', target: 'soc', desc: '系统级验证工具' },
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

        const isDirectHover = (hoveredNode === link.source && link.target) || (hoveredNode === link.target && link.source);

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
            {/* Animated particle for active flow */}
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
      className={`absolute flex flex-col items-center justify-center cursor-pointer transition-all duration-300 z-10 w-32 h-32 -ml-16 -mt-16`}
      style={{ left: `${x}%`, top: `${y}%` }}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(node.id)}
      animate={{
        scale: isSelected ? 1.2 : isDimmed ? 0.9 : 1,
        opacity: isDimmed ? 0.4 : 1,
      }}
    >
      {/* Outer Glow Ring */}
      <div 
        className={`absolute inset-0 rounded-full border border-dashed transition-all duration-500 ${isSelected ? 'animate-spin-slow border-neon-blue opacity-100' : 'border-slate-700 opacity-30'}`}
        style={{ width: '140%', height: '140%', left: '-20%', top: '-20%' }}
      />

      {/* Hexagon/Circle Container */}
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
        
        {/* Connection points (Visual flair) */}
        <div className="absolute -top-1 w-2 h-2 bg-slate-600 rounded-full" />
        <div className="absolute -bottom-1 w-2 h-2 bg-slate-600 rounded-full" />
      </div>

      {/* Label */}
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
                 
                 {/* "Big White Words" Style */}
                 <p className="text-xl font-bold text-white mb-3 leading-tight tracking-tight">
                   {rep.intro}
                 </p>
                 
                 <div className="text-sm text-slate-300 leading-relaxed space-y-2 border-l-2 border-slate-700 pl-3">
                   <p>{rep.achievement}</p>
                 </div>
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
  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute top-0 right-0 h-full w-full md:w-[480px] bg-slate-900/95 backdrop-blur-2xl border-l border-slate-700 z-50 p-8 shadow-2xl flex flex-col"
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
      >
        <X size={24} />
      </button>

      <div className="mt-8 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-4 rounded-xl bg-slate-800 border border-slate-600 shadow-lg shadow-black/50">
            <node.icon size={40} style={{ color: node.color }} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">{node.label}</h2>
            <p className="text-neon-blue font-mono text-xs mt-2 flex items-center gap-2 tracking-wider">
              <Share2 size={12} />
              MODULE ID: {node.id.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700 my-6" />
        
        <div className="space-y-8 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-10">
          {/* Section 1: Plain English */}
          <section>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Info size={14} /> 通俗解读
            </h3>
            <div className="p-5 rounded-lg bg-slate-800/50 border border-slate-700/50">
               <p className="text-xl text-emerald-300 font-bold leading-relaxed mb-2">
                "{node.subLabel}"
              </p>
              <p className="text-slate-300 leading-relaxed text-sm">
                {node.description}
              </p>
            </div>
          </section>

          {/* Section 2: Technical Deep Dive */}
          <section>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
              领域详情
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm">
              {node.details}
            </p>
          </section>

          {/* Section 3: Key People - Interactive */}
          <section>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
              清华科研代表团队 (Interactive)
            </h3>
            <div className="grid gap-3">
              {node.reps.map((rep, idx) => (
                <ProfessorCard key={idx} rep={rep} color={node.color} />
              ))}
            </div>
          </section>
        </div>
      </div>
      
      {/* Footer Decoration */}
      <div className="mt-auto pt-4 border-t border-slate-800">
         <div className="flex justify-between text-[10px] text-slate-600 font-mono">
           <span>SYS.STATUS: ONLINE</span>
           <span>DATA: TSINGHUA EE</span>
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
      <header className="absolute top-6 left-6 z-40">
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
        <div className={`relative w-[90vmin] h-[90vmin] md:w-[70vmin] md:h-[70vmin] transition-all duration-700 ${selectedNodeId ? 'md:mr-[400px] scale-90' : ''}`}>
          
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

        </div>
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
      <div className="absolute bottom-6 left-6 text-slate-500 text-xs font-mono">
        <p>HOVER TO REVEAL DEPENDENCIES</p>
        <p>CLICK NODES FOR DATA ANALYSIS</p>
      </div>

    </div>
  );
};

export default App;