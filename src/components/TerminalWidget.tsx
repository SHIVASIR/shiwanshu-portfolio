/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, RotateCcw, Check, Copy } from 'lucide-react';
import { personalInfo } from '../data';
import { trackEvent } from '../lib/analytics';

interface HistoryEntry {
  command: string;
  output: React.ReactNode;
  timestamp: string;
}

const PRESET_COMMANDS = [
  { cmd: 'whoami', label: 'whoami' },
  { cmd: 'skills --list', label: 'skills --list' },
  { cmd: 'status --check', label: 'status --check' },
  { cmd: 'projects --summary', label: 'projects --summary' },
  { cmd: 'contact --info', label: 'contact --info' },
  { cmd: 'clear', label: 'clear' },
];

export default function TerminalWidget() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [copied, setCopied] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-run `whoami` on mount
  useEffect(() => {
    executeCommand('whoami', false);
  }, []);

  // Auto-scroll to bottom of terminal content
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = (rawCmd: string, track: boolean = true) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    if (track) {
      trackEvent('terminal_command', 'interaction', cmd);
    }

    if (cmd === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    }

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    let outputNode: React.ReactNode;

    switch (cmd) {
      case 'whoami':
        outputNode = (
          <div className="space-y-1.5 text-zinc-300 font-mono text-xs">
            <div className="text-blue-400 font-bold flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SHIWANSHU KUMAR SINGH</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-zinc-400 pt-1">
              <div><span className="text-zinc-500">Role:</span> Software Engineer / CS Undergrad</div>
              <div><span className="text-zinc-500">Degree:</span> B.Tech CSE (2022 - 2026)</div>
              <div><span className="text-zinc-500">Focus:</span> Cloud Architecture & ML Systems</div>
              <div><span className="text-zinc-500">Achievements:</span> SIH 2024 Finalist (Team Lead)</div>
            </div>
          </div>
        );
        break;

      case 'skills --list':
        outputNode = (
          <div className="space-y-2 text-zinc-300 font-mono text-xs">
            <div className="text-emerald-400 font-bold">CORE TECHNICAL COMPETENCIES</div>
            <div className="space-y-1 text-[11px]">
              <div><span className="text-blue-400 font-bold">Languages: </span> Python (92%), C++ (85%), TypeScript (88%), SQL (84%)</div>
              <div><span className="text-cyan-400 font-bold">Machine Learning: </span> LightGBM, PyTorch, Scikit-Learn, SMOTE, Pandas, NumPy</div>
              <div><span className="text-amber-400 font-bold">Cloud & DevOps: </span> AWS, Azure, Docker microservices, Linux CLI, Git</div>
              <div><span className="text-indigo-400 font-bold">Databases: </span> PostgreSQL, MySQL, B+ Tree file systems, Firestore</div>
            </div>
          </div>
        );
        break;

      case 'status --check':
        outputNode = (
          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>AVAILABLE FOR RECRUITMENT & SDE ROLES</span>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-300 space-y-1">
              <div><span className="text-zinc-500">Target Positions:</span> Software Development Engineer (SDE), ML Engineer, Backend</div>
              <div><span className="text-zinc-500">Availability:</span> Immediate / Internship & Full-time 2026</div>
              <div><span className="text-zinc-500">Location Preference:</span> Remote / Hybrid / On-site (Pan-India & Global)</div>
              <div className="text-emerald-400 font-semibold pt-0.5">✔ 100% Ready for technical interviews & coding assessments</div>
            </div>
          </div>
        );
        break;

      case 'projects --summary':
        outputNode = (
          <div className="space-y-1.5 text-zinc-300 font-mono text-[11px]">
            <div className="text-cyan-400 font-bold text-xs mb-1">FEATURED REPOSITORIES & SYSTEMS</div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-400 font-bold">1.</span>
              <div>
                <span className="font-bold text-white">Credit Card Fraud Detection</span>
                <span className="text-zinc-500"> — LightGBM model with SMOTE sampling (0.96+ ROC-AUC)</span>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-400 font-bold">2.</span>
              <div>
                <span className="font-bold text-white">Cloud-Native ML Microservice</span>
                <span className="text-zinc-500"> — Containerized Docker engine with &lt;18ms P95 latency</span>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-400 font-bold">3.</span>
              <div>
                <span className="font-bold text-white">Relational Query Optimizer</span>
                <span className="text-zinc-500"> — C++17 relational engine with custom B+ tree indexing</span>
              </div>
            </div>
          </div>
        );
        break;

      case 'contact --info':
        outputNode = (
          <div className="space-y-1 text-zinc-300 font-mono text-[11px]">
            <div className="text-indigo-400 font-bold text-xs mb-1">DIRECT CONTACT HANDLES</div>
            <div><span className="text-zinc-500">Email:    </span> <a href={`mailto:${personalInfo.email}`} className="text-blue-400 hover:underline">{personalInfo.email}</a></div>
            <div><span className="text-zinc-500">GitHub:   </span> <a href={personalInfo.github} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{personalInfo.github}</a></div>
            <div><span className="text-zinc-500">LinkedIn: </span> <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{personalInfo.linkedin}</a></div>
          </div>
        );
        break;

      case 'help':
        outputNode = (
          <div className="space-y-1 text-zinc-300 font-mono text-[11px]">
            <div className="text-yellow-400 font-bold text-xs mb-1">AVAILABLE COMMANDS</div>
            <div><span className="text-blue-400 font-bold">whoami</span> - Display developer profile and summary</div>
            <div><span className="text-blue-400 font-bold">skills --list</span> - View core engineering skill percentages</div>
            <div><span className="text-blue-400 font-bold">status --check</span> - Check hiring status and availability</div>
            <div><span className="text-blue-400 font-bold">projects --summary</span> - List key production projects</div>
            <div><span className="text-blue-400 font-bold">contact --info</span> - Get email, GitHub, and LinkedIn links</div>
            <div><span className="text-blue-400 font-bold">clear</span> - Clear terminal buffer output</div>
          </div>
        );
        break;

      default:
        outputNode = (
          <div className="text-red-400 font-mono text-[11px]">
            Command not recognized: '<span className="text-white">{cmd}</span>'. Type <button onClick={() => executeCommand('help')} className="underline text-blue-400 font-bold">help</button> to view valid commands.
          </div>
        );
    }

    setHistory((prev) => [
      ...prev,
      {
        command: rawCmd,
        output: outputNode,
        timestamp: time,
      },
    ]);
    setInputVal('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(inputVal);
  };

  const copyTerminalHistory = () => {
    const textToCopy = history
      ? history.map((h) => `$ ${h.command}\n[Output rendered in UI]`).join('\n\n')
      : '';
    navigator.clipboard.writeText(textToCopy || 'shiwanshu@macbook-pro:~$ whoami');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl bg-[#05060A] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden font-mono text-left select-none relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#36BFFF]/5 rounded-full blur-2xl pointer-events-none" />

      {/* Futuristic Terminal Top Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#080B12] border-b border-white/10">
        {/* Window Status Dots */}
        <div className="flex items-center space-x-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF2D9B] inline-block shadow-[0_0_8px_rgba(255,45,155,0.6)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#36BFFF] inline-block shadow-[0_0_8px_rgba(54,191,255,0.6)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20 inline-block" />
        </div>

        {/* Terminal Header Title */}
        <div className="flex items-center space-x-2 text-xs text-[#9299AA] font-semibold">
          <TerminalIcon className="h-3.5 w-3.5 text-[#36BFFF]" />
          <span className="font-mono text-[#F5F7FF] tracking-wider text-[11px]">shiwanshu@cloud-kernel:~ (zsh)</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => executeCommand('clear')}
            className="p-1 text-[#9299AA] hover:text-[#36BFFF] transition-colors cursor-pointer"
            title="Clear Terminal Output"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={copyTerminalHistory}
            className="p-1 text-[#9299AA] hover:text-[#36BFFF] transition-colors cursor-pointer"
            title="Copy Terminal Log"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Preset Command Chips for Quick Click Interaction */}
      <div className="px-3.5 py-2.5 bg-[#05060A] border-b border-white/10 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-[10px] text-[#9299AA] uppercase font-bold tracking-wider shrink-0 mr-1">RUN:</span>
        {PRESET_COMMANDS.map((preset) => (
          <button
            key={preset.cmd}
            onClick={() => executeCommand(preset.cmd)}
            className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-white/5 border border-white/10 text-[#9299AA] hover:text-[#36BFFF] hover:border-[#36BFFF]/50 hover:bg-[#36BFFF]/10 transition-all shrink-0 flex items-center space-x-1 cursor-pointer"
          >
            <span className="text-[#36BFFF] font-bold">$</span>
            <span>{preset.label}</span>
          </button>
        ))}
      </div>

      {/* Terminal Content Buffer */}
      <div className="p-4 max-h-[260px] sm:max-h-[300px] overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-white/10 text-xs">
        {history.map((item, index) => (
          <div key={index} className="space-y-2">
            {/* Command Input Prompt Line */}
            <div className="flex items-center space-x-2 text-[#9299AA]">
              <span className="text-[#36BFFF] font-bold">shiwanshu@cloud</span>
              <span className="text-white/30">:</span>
              <span className="text-[#FF2D9B] font-bold">~</span>
              <span className="text-[#F5F7FF] font-bold">$ {item.command}</span>
              <span className="text-[9px] text-[#9299AA]/60 ml-auto">{item.timestamp}</span>
            </div>

            {/* Output Render */}
            <div className="pl-3 border-l-2 border-[#36BFFF]/40 py-0.5">
              {item.output}
            </div>
          </div>
        ))}

        {/* Active Command Input Line */}
        <form onSubmit={handleFormSubmit} className="flex items-center space-x-2 pt-1">
          <span className="text-[#36BFFF] font-bold">shiwanshu@cloud</span>
          <span className="text-white/30">:</span>
          <span className="text-[#FF2D9B] font-bold">~</span>
          <span className="text-[#F5F7FF] font-bold">$</span>
          <div className="relative flex-1 flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="type 'help' or click presets above..."
              className="w-full bg-transparent text-xs font-mono text-[#F5F7FF] placeholder-[#9299AA]/50 focus:outline-none"
            />
            {/* Blinking Cursor Visual Indicator */}
            <span className="w-2 h-4 bg-[#36BFFF] animate-pulse ml-0.5 shrink-0 inline-block shadow-[0_0_8px_#36BFFF]" />
          </div>
        </form>

        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}
