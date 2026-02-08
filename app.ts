import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// --- Models ---
interface TechSkill {
  name: string;
  category: 'Backend' | 'Frontend' | 'DevOps' | 'Data';
  level: number; // 0-100
  icon: string;
}

interface Experience {
  company: string;
  role: string;
  period: string;
  status: 'Active' | 'Stable' | 'Deprecated' | 'Migrated'; // DevOps terminology
  description: string;
  stack: string[];
  metrics: { label: string; value: string; trend: 'up' | 'down' | 'stable' }[];
}

interface Project {
  name: string;
  client: string;
  type: 'Microservices' | 'Monolith' | 'Migration' | 'DevOps' | 'Architecture';
  description: string;
  stack: string[];
  status: 'Live' | 'Completed' | 'Maintenance' | 'Pending';
  architecture: string; // Simple description for visual
}

interface Doc {
  id: string;
  title: string;
  type: 'ADR' | 'RFC' | 'Manual' | 'Policy';
  tags: string[];
  lastUpdated: string;
  content: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-cyan-500 selection:text-white overflow-hidden flex flex-col md:flex-row">

      <!-- Sidebar / Navigation -->
      <nav class="w-full md:w-20 lg:w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          <div class="p-6 flex items-center gap-3">
            <!-- Avatar with Fallback Logic -->
            <div class="relative w-12 h-12 shrink-0">
              <img 
                src="kojo-ampia-addison.jpeg" 
                alt="John Kojo"
                class="w-full h-full rounded-full object-cover border-2 border-cyan-500 shadow-lg shadow-cyan-500/20"
                [class.hidden]="avatarError()"
                (error)="avatarError.set(true)"
              >
              <div 
                *ngIf="avatarError()" 
                class="w-full h-full rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20 border-2 border-cyan-500/50"
              >
                JK
              </div>
            </div>
            <span class="font-bold text-lg tracking-tight hidden lg:block text-slate-100">Kojo.Stack</span>
          </div>

          <div class="px-3 py-2 space-y-1">
            <button 
              *ngFor="let view of ['Dashboard', 'Projects', 'Docs', 'Settings']"
              (click)="currentView.set(view)"
              [ngClass]="currentView() === view ? 'bg-blue-600/10 text-cyan-400 border-l-4 border-cyan-400' : 'border-transparent'"
              class="w-full text-left px-4 py-3 rounded-r transition-all hover:bg-slate-900 text-sm font-medium flex items-center gap-3 group border-l-4"
            >
              <i class="fas fa-circle text-[8px] opacity-50 group-hover:text-cyan-400 transition-colors"></i>
              <span class="hidden lg:block">{{ view }}</span>
            </button>
          </div>
        </div>

        <div class="p-6 hidden lg:block">
          <div class="bg-slate-900 rounded p-4 border border-slate-800">
            <div class="text-xs text-slate-500 uppercase font-semibold mb-2">System Health</div>
            <div class="flex items-center gap-2 text-green-400 text-sm font-bold">
              <span class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              Operational
            </div>
            <div class="mt-2 text-xs text-slate-400">Uptime: 99.99%</div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto h-screen scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        
        <!-- Header -->
        <header class="bg-slate-900/80 backdrop-blur border-b border-slate-800 sticky top-0 z-10 px-6 py-4 flex justify-between items-center">
          <div>
            <h1 class="text-xl font-bold text-white">John Kojo Ampia-Addison</h1>
            <p class="text-sm text-cyan-500 font-mono">Senior Software Architect & DevOps Engineer</p>
          </div>
          <div class="flex gap-4">
             <button class="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-sm transition-colors text-slate-300" (click)="generatePDF()">
              <i class="fas fa-download mr-2"></i> Export CV
             </button>
             <button 
                class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm shadow-lg shadow-blue-500/20 transition-all font-medium"
                (click)="currentView.set('Hire')">
              Hire Consultant
             </button>
          </div>
        </header>

        <div class="p-6 lg:p-10 space-y-8">

          <!-- VIEW: DASHBOARD -->
          @if (currentView() === 'Dashboard') {
            <!-- KPI Cards (Grafana Style) -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="bg-slate-800/50 border border-slate-700 p-5 rounded-lg hover:border-cyan-500/50 transition-colors">
                <div class="text-slate-400 text-xs font-mono uppercase tracking-wider mb-1">Total Experience</div>
                <div class="text-3xl font-bold text-white">16+ <span class="text-sm text-slate-500 font-normal">Years</span></div>
                <div class="mt-2 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                  <div class="h-full bg-cyan-500 w-[95%]"></div>
                </div>
              </div>
              <div class="bg-slate-800/50 border border-slate-700 p-5 rounded-lg hover:border-purple-500/50 transition-colors">
                <div class="text-slate-400 text-xs font-mono uppercase tracking-wider mb-1">Projects Delivered</div>
                <div class="text-3xl font-bold text-white">20+ <span class="text-sm text-slate-500 font-normal">Systems</span></div>
                <div class="mt-2 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                  <div class="h-full bg-purple-500 w-[85%]"></div>
                </div>
              </div>
               <div class="bg-slate-800/50 border border-slate-700 p-5 rounded-lg hover:border-green-500/50 transition-colors">
                <div class="text-slate-400 text-xs font-mono uppercase tracking-wider mb-1">Stack Coverage</div>
                <div class="text-3xl font-bold text-white">Full <span class="text-sm text-slate-500 font-normal">Stack</span></div>
                <div class="text-xs text-green-400 mt-1">Java • Angular • K8s</div>
              </div>
               <div class="bg-slate-800/50 border border-slate-700 p-5 rounded-lg hover:border-orange-500/50 transition-colors">
                <div class="text-slate-400 text-xs font-mono uppercase tracking-wider mb-1">Current Status</div>
                <div class="text-3xl font-bold text-orange-400">BUSY</div>
                <div class="text-xs text-slate-400 mt-1">@ BRZ (Federal Computing)</div>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <!-- Left Col: Experience Timeline -->
              <div class="lg:col-span-2 space-y-6">
                <div class="flex items-center justify-between">
                  <h2 class="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <i class="fas fa-server text-cyan-500"></i> Service Registry (Experience)
                  </h2>
                  <div class="flex gap-2">
                    <span class="px-2 py-1 rounded bg-green-500/10 text-green-400 text-xs border border-green-500/20">Active</span>
                    <span class="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20">Stable</span>
                  </div>
                </div>

                <div class="space-y-4">
                  @for (job of experiences(); track job.company) {
                    <div class="group relative bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-lg p-5 transition-all hover:shadow-xl hover:shadow-black/50">
                      <!-- Status Indicator Line -->
                      <div class="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg transition-colors"
                        [ngClass]="{
                          'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]': job.status === 'Active',
                          'bg-blue-500': job.status === 'Stable',
                          'bg-slate-600': job.status === 'Migrated' || job.status === 'Deprecated'
                        }">
                      </div>

                      <div class="pl-4">
                        <div class="flex justify-between items-start mb-2">
                          <div>
                            <h3 class="font-bold text-lg text-slate-100 group-hover:text-cyan-400 transition-colors">{{ job.company }}</h3>
                            <div class="text-sm text-slate-400 font-mono">{{ job.role }}</div>
                          </div>
                          <div class="text-right">
                            <div class="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {{ job.period }}
                            </div>
                            <div class="mt-1 text-xs font-bold uppercase tracking-wider"
                               [ngClass]="{
                                'text-green-400': job.status === 'Active',
                                'text-blue-400': job.status === 'Stable',
                                'text-slate-500': job.status === 'Deprecated'
                               }">
                              {{ job.status }}
                            </div>
                          </div>
                        </div>
                        
                        <p class="text-slate-400 text-sm mb-4 leading-relaxed border-l-2 border-slate-800 pl-3">
                          {{ job.description }}
                        </p>

                        <!-- Metrics Grid -->
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4 bg-slate-950/50 p-3 rounded border border-slate-800/50">
                           @for (metric of job.metrics; track metric.label) {
                             <div>
                               <div class="text-[10px] uppercase text-slate-500 font-bold">{{ metric.label }}</div>
                               <div class="text-sm font-mono text-slate-200 flex items-center gap-1">
                                 {{ metric.value }}
                                 <i class="fas fa-arrow-up text-[10px] text-green-500" *ngIf="metric.trend === 'up'"></i>
                               </div>
                             </div>
                           }
                        </div>

                        <div class="flex flex-wrap gap-2 mt-3">
                          @for (tech of job.stack; track tech) {
                            <span class="px-2 py-1 text-xs rounded bg-slate-800 text-cyan-200/80 border border-slate-700/50 font-mono hover:bg-cyan-900/30 cursor-default">
                              {{ tech }}
                            </span>
                          }
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Right Col: Tech Radar & Utils -->
              <div class="space-y-6">
                
                <!-- Tech Radar Widget -->
                <div class="bg-slate-900 border border-slate-800 rounded-lg p-5">
                  <h2 class="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                    <i class="fas fa-radar text-purple-500"></i> Tech Radar
                  </h2>
                  <div class="space-y-5">
                    @for (category of ['Backend', 'DevOps', 'Frontend', 'Data']; track category) {
                      <div>
                        <h4 class="text-xs font-bold uppercase text-slate-500 mb-2 tracking-widest">{{ category }}</h4>
                        <div class="space-y-2">
                          @for (skill of getSkillsByCategory(category); track skill.name) {
                            <div class="group">
                              <div class="flex justify-between text-xs mb-1">
                                <span class="text-slate-300 group-hover:text-white transition-colors">{{ skill.name }}</span>
                                <span class="text-slate-500 font-mono">{{ skill.level }}%</span>
                              </div>
                              <div class="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div class="h-full rounded-full transition-all duration-1000 ease-out"
                                     [style.width.%]="skill.level"
                                     [ngClass]="{
                                        'bg-blue-500': category === 'Backend',
                                        'bg-purple-500': category === 'DevOps',
                                        'bg-pink-500': category === 'Frontend',
                                        'bg-amber-500': category === 'Data'
                                     }">
                                </div>
                              </div>
                            </div>
                          }
                        </div>
                      </div>
                    }
                  </div>
                </div>

                <!-- Education Node -->
                <div class="bg-slate-900 border border-slate-800 rounded-lg p-5">
                  <h2 class="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                    <i class="fas fa-graduation-cap text-yellow-500"></i> Education Node
                  </h2>
                  <div class="relative pl-4 border-l border-slate-700 space-y-4">
                    <div class="relative">
                      <span class="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-slate-700 border-2 border-slate-900"></span>
                      <div class="text-sm font-bold text-slate-200">TU Vienna</div>
                      <div class="text-xs text-slate-400">Software & Systems Engineering</div>
                      <div class="text-xs text-slate-500 font-mono mt-1">2004 - 2010</div>
                    </div>
                    <div class="relative">
                      <span class="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-slate-700 border-2 border-slate-900"></span>
                      <div class="text-sm font-bold text-slate-200">Mfantsipim School</div>
                      <div class="text-xs text-slate-400">Adv. Level Mathematics & Physics</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          }

          <!-- VIEW: PROJECTS -->
          @if (currentView() === 'Projects') {
            <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold text-slate-100 flex items-center gap-3">
                  <i class="fas fa-code-branch text-cyan-500"></i>
                  Deployed Systems Registry
                </h2>
                <div class="flex gap-2">
                   <span class="px-3 py-1 bg-slate-800 rounded text-xs text-slate-400 border border-slate-700">Filter: All Systems</span>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                @for (project of projects(); track project.name) {
                  <div class="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden group hover:border-cyan-500/50 transition-all hover:shadow-2xl hover:shadow-cyan-900/10 flex flex-col">
                    <!-- Project Header -->
                    <div class="p-5 border-b border-slate-800 bg-slate-950/30">
                      <div class="flex justify-between items-start mb-3">
                        <div class="inline-flex px-2 py-1 rounded bg-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 border border-slate-700">
                          {{ project.type }}
                        </div>
                        <div class="flex items-center gap-1.5">
                          <span class="h-2 w-2 rounded-full" 
                            [ngClass]="{
                              'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]': project.status === 'Live',
                              'bg-blue-500': project.status === 'Completed',
                              'bg-amber-500': project.status === 'Maintenance',
                              'bg-slate-500 animate-pulse': project.status === 'Pending'
                            }"></span>
                          <span class="text-xs font-mono text-slate-400">{{ project.status }}</span>
                        </div>
                      </div>
                      <h3 class="text-lg font-bold text-slate-100 mb-1 group-hover:text-cyan-400 transition-colors">{{ project.name }}</h3>
                      <div class="text-xs text-slate-500 flex items-center gap-2">
                        <i class="fas fa-building opacity-50"></i> {{ project.client }}
                      </div>
                    </div>

                    <!-- Project Body -->
                    <div class="p-5 flex-1 flex flex-col justify-between">
                      <div class="space-y-4">
                        <p class="text-sm text-slate-400 leading-relaxed">{{ project.description }}</p>
                        
                        <!-- Visual Architecture Block (Abstract) -->
                        <div class="bg-slate-950 rounded border border-slate-800 p-3">
                          <div class="text-[10px] text-slate-600 uppercase font-bold mb-2">Architecture Topology</div>
                          <div class="flex items-center gap-2 opacity-70">
                             <div class="h-8 w-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-500"><i class="fas fa-cube"></i></div>
                             <div class="h-px w-4 bg-slate-700"></div>
                             <div class="h-8 w-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-purple-500"><i class="fas fa-network-wired"></i></div>
                             <div class="h-px w-4 bg-slate-700"></div>
                             <div class="h-8 w-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-green-500"><i class="fas fa-database"></i></div>
                          </div>
                        </div>
                      </div>

                      <!-- Stack Footer -->
                      <div class="mt-5 pt-4 border-t border-slate-800/50">
                        <div class="flex flex-wrap gap-2">
                           @for (tech of project.stack; track tech) {
                             <span class="text-[10px] px-2 py-1 rounded bg-slate-800/50 text-cyan-200/60 border border-slate-700/50">
                               {{ tech }}
                             </span>
                           }
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          <!-- VIEW: DOCS -->
          @if (currentView() === 'Docs') {
             <div class="flex flex-col md:flex-row gap-6 h-[calc(100vh-140px)] animate-in fade-in">
                <!-- Doc List -->
                <div class="w-full md:w-1/3 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col">
                   <div class="p-4 border-b border-slate-800 bg-slate-950/50 font-bold text-slate-200 flex justify-between items-center">
                     <span>Knowledge Base</span>
                     <span class="text-[10px] bg-slate-800 px-2 py-1 rounded border border-slate-700">v2026.1</span>
                   </div>
                   <div class="overflow-y-auto p-2 space-y-2 flex-1">
                     @for (doc of docs(); track doc.id) {
                       <button 
                         (click)="selectedDoc.set(doc)"
                         [ngClass]="selectedDoc()?.id === doc.id ? 'bg-blue-600/20 border-blue-500 shadow-md shadow-blue-900/20' : 'bg-slate-800/30 border-transparent hover:border-slate-600 hover:bg-slate-800'"
                         class="w-full text-left p-3 rounded border transition-all group relative"
                       >
                         <div class="flex justify-between items-start mb-1">
                           <span class="text-xs font-mono text-cyan-500">{{ doc.id }}</span>
                           <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">{{ doc.type }}</span>
                         </div>
                         <div class="font-bold text-sm text-slate-200 mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">{{ doc.title }}</div>
                         <div class="flex flex-wrap gap-1">
                           @for (tag of doc.tags; track tag) {
                             <span class="text-[9px] text-slate-500 px-1 rounded bg-slate-900">#{{tag}}</span>
                           }
                         </div>
                       </button>
                     }
                   </div>
                </div>

                <!-- Doc Viewer -->
                <div class="w-full md:w-2/3 bg-slate-900 border border-slate-800 rounded-lg p-6 overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                  @if (selectedDoc(); as doc) {
                    <div class="absolute top-10 right-10 opacity-[0.03] pointer-events-none select-none">
                      <i class="fas fa-file-code text-9xl"></i>
                    </div>
                    
                    <div class="mb-8 border-b border-slate-800 pb-6">
                      <div class="flex items-center gap-3 mb-4">
                        <span class="px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20 tracking-wider uppercase">{{ doc.type }}</span>
                        <span class="text-slate-500 text-xs font-mono"><i class="far fa-clock mr-1"></i> Updated: {{ doc.lastUpdated }}</span>
                      </div>
                      <h2 class="text-3xl font-bold text-white mb-2">{{ doc.title }}</h2>
                      <div class="text-sm text-slate-500">ID: <span class="font-mono text-slate-400">{{ doc.id }}</span></div>
                    </div>

                    <div class="prose prose-invert prose-sm max-w-none text-slate-300">
                      <div class="whitespace-pre-wrap font-mono text-sm leading-relaxed">{{ doc.content }}</div>
                    </div>
                  } @else {
                    <div class="h-full flex flex-col items-center justify-center text-slate-500 opacity-50 select-none">
                      <div class="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-6">
                         <i class="fas fa-book text-4xl text-slate-600"></i>
                      </div>
                      <h3 class="text-xl font-bold text-slate-400 mb-2">Select a Document</h3>
                      <p class="text-sm">View Architectural Decision Records (ADRs) and specs.</p>
                    </div>
                  }
                </div>
             </div>
          }

          <!-- VIEW: SETTINGS -->
          @if (currentView() === 'Settings') {
            <div class="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div class="flex justify-between items-center border-b border-slate-800 pb-4">
                 <div>
                   <h2 class="text-xl font-bold text-slate-100 flex items-center gap-3">
                     <i class="fas fa-cog text-slate-400"></i>
                     System Configuration
                   </h2>
                   <p class="text-sm text-slate-500 mt-1">Manage global preferences and API keys.</p>
                 </div>
                 <button (click)="saveSettings()" class="bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold py-2 px-4 rounded shadow-lg shadow-cyan-500/20 transition-all">
                   Save Changes
                 </button>
               </div>

               <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                 
                 <!-- Identity Card -->
                 <div class="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
                   <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">User Identity</h3>
                   
                   <div class="space-y-1">
                     <label class="text-xs text-slate-500">Full Name</label>
                     <input type="text" value="John Kojo Ampia-Addison" class="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-300 focus:border-cyan-500 focus:outline-none transition-colors">
                   </div>
                   
                   <div class="space-y-1">
                     <label class="text-xs text-slate-500">Professional Title</label>
                     <input type="text" value="Senior Software Architect" class="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-300 focus:border-cyan-500 focus:outline-none transition-colors">
                   </div>

                   <div class="space-y-1">
                     <label class="text-xs text-slate-500">Primary Email</label>
                     <input type="email" value="kojo@example.com" disabled class="w-full bg-slate-950/50 border border-slate-800 rounded p-2 text-sm text-slate-500 cursor-not-allowed">
                   </div>
                 </div>

                 <!-- Environment Config -->
                 <div class="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
                    <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Environment Variables</h3>
                    
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-slate-300">Verbose Logging</span>
                      <button class="w-10 h-5 bg-cyan-600 rounded-full relative cursor-pointer shadow-inner">
                        <span class="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></span>
                      </button>
                    </div>

                    <div class="flex items-center justify-between">
                      <span class="text-sm text-slate-300">Beta Features (Experimental)</span>
                       <button class="w-10 h-5 bg-slate-700 rounded-full relative cursor-pointer shadow-inner">
                        <span class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></span>
                      </button>
                    </div>

                    <div class="space-y-1 pt-2">
                       <label class="text-xs text-slate-500">System Theme</label>
                       <select class="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-300 focus:border-cyan-500 focus:outline-none">
                         <option>Default Dark (Slate)</option>
                         <option>High Contrast</option>
                         <option>Midnight Blue</option>
                       </select>
                    </div>
                 </div>

                 <!-- API Access -->
                 <div class="bg-slate-900 border border-slate-800 rounded-lg p-6 md:col-span-2 space-y-4">
                    <div class="flex justify-between items-center border-b border-slate-800 pb-2">
                       <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider">API Access Tokens</h3>
                       <button class="text-xs text-cyan-500 hover:text-cyan-400 underline">Generate New Token</button>
                    </div>

                    <div class="bg-slate-950 rounded border border-slate-800 p-4 flex items-center justify-between">
                      <div>
                        <div class="text-sm font-bold text-slate-200">Portfolio Read-Only</div>
                        <div class="text-xs text-slate-500 font-mono mt-1">kojo_pat_837482...8473</div>
                      </div>
                      <div class="flex items-center gap-3">
                         <span class="text-[10px] bg-green-900/30 text-green-400 px-2 py-1 rounded border border-green-900/50">Active</span>
                         <button class="text-slate-500 hover:text-red-400 transition-colors"><i class="fas fa-trash"></i></button>
                      </div>
                    </div>
                 </div>

                 <!-- Danger Zone -->
                 <div class="border border-red-900/30 bg-red-950/10 rounded-lg p-6 md:col-span-2 space-y-4">
                    <h3 class="text-sm font-bold text-red-400 uppercase tracking-wider mb-2">Danger Zone</h3>
                    <div class="flex items-center justify-between">
                       <div>
                         <div class="text-sm text-slate-300 font-bold">Flush Local Cache</div>
                         <div class="text-xs text-slate-500">Clears all locally stored analytics and session data.</div>
                       </div>
                       <button class="border border-red-900 text-red-500 hover:bg-red-900/20 px-3 py-1.5 rounded text-xs font-bold transition-colors">Flush Data</button>
                    </div>
                 </div>

               </div>
            </div>
          }

          <!-- VIEW: HIRE CONSULTANT -->
          @if (currentView() === 'Hire') {
            <div class="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div class="flex justify-between items-center mb-8">
                 <div>
                   <h2 class="text-2xl font-bold text-slate-100 flex items-center gap-3">
                     <i class="fas fa-handshake text-cyan-500"></i>
                     Engagement Protocol
                   </h2>
                   <p class="text-sm text-slate-500 mt-1">Initialize a new consulting contract or project scope.</p>
                 </div>
               </div>

               <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                 
                 <!-- Contract Form -->
                 <div class="md:col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-xl">
                   <form (submit)="submitInquiry()" class="space-y-6">
                     <div class="grid grid-cols-2 gap-4">
                       <div class="space-y-2">
                         <label class="text-xs uppercase font-bold text-slate-500">Client Entity / Name</label>
                         <input type="text" [(ngModel)]="inquiry.name" name="name" required placeholder="Company or Contact Name" 
                                class="w-full bg-slate-950 border border-slate-700 rounded p-3 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none transition-colors">
                       </div>
                       <div class="space-y-2">
                         <label class="text-xs uppercase font-bold text-slate-500">Contact Point / Email</label>
                         <input type="email" [(ngModel)]="inquiry.email" name="email" required placeholder="email@company.com" 
                                class="w-full bg-slate-950 border border-slate-700 rounded p-3 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none transition-colors">
                       </div>
                     </div>

                     <div class="space-y-2">
                       <label class="text-xs uppercase font-bold text-slate-500">Engagement Type</label>
                       <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                         @for(type of ['Architecture', 'DevOps', 'Migration']; track type) {
                           <button type="button" 
                                   (click)="inquiry.type = type"
                                   [ngClass]="inquiry.type === type ? 'bg-cyan-600/20 border-cyan-500 text-cyan-400' : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-500'"
                                   class="py-2 px-3 rounded border text-sm font-medium transition-all text-center">
                             {{ type }}
                           </button>
                         }
                       </div>
                     </div>

                     <div class="space-y-2">
                       <label class="text-xs uppercase font-bold text-slate-500">Project Scope / Mission</label>
                       <textarea [(ngModel)]="inquiry.message" name="message" rows="5" required
                                 placeholder="Describe the system architecture, pain points, or migration goals..."
                                 class="w-full bg-slate-950 border border-slate-700 rounded p-3 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none transition-colors font-mono"></textarea>
                     </div>

                     <div class="pt-4 border-t border-slate-800 flex justify-end">
                       <button type="submit" class="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2">
                         <span>Initialize Contract</span>
                         <i class="fas fa-terminal"></i>
                       </button>
                     </div>
                   </form>
                 </div>

                 <!-- Service Catalog / Status -->
                 <div class="space-y-6">
                   <div class="bg-slate-900 border border-slate-800 rounded-lg p-6">
                     <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Availability Status</h3>
                     <div class="flex items-center gap-3 mb-2">
                       <div class="relative flex h-3 w-3">
                          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                          <span class="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                        </div>
                       <span class="text-orange-400 font-bold">High Load (Waitlist)</span>
                     </div>
                     <p class="text-xs text-slate-500 leading-relaxed">
                       Currently fully booked with BRZ projects. Accepting new architectural consultations starting Q3 2026.
                     </p>
                   </div>

                   <div class="bg-slate-900 border border-slate-800 rounded-lg p-6">
                     <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Core Services</h3>
                     <ul class="space-y-3">
                       <li class="flex items-start gap-3 text-sm text-slate-300">
                         <i class="fas fa-check text-cyan-500 mt-1"></i>
                         <span>Cloud Native Transformation (K8s)</span>
                       </li>
                       <li class="flex items-start gap-3 text-sm text-slate-300">
                         <i class="fas fa-check text-cyan-500 mt-1"></i>
                         <span>Legacy Java to Microservices</span>
                       </li>
                       <li class="flex items-start gap-3 text-sm text-slate-300">
                         <i class="fas fa-check text-cyan-500 mt-1"></i>
                         <span>Observability & Monitoring</span>
                       </li>
                     </ul>
                   </div>
                 </div>

               </div>
            </div>
          }

          <!-- Footer -->
          <footer class="border-t border-slate-800 pt-6 mt-10 text-center text-slate-500 text-sm">
            <div class="flex justify-center gap-6 mb-4">
               <span class="hover:text-cyan-400 cursor-pointer transition-colors"><i class="fas fa-map-marker-alt mr-2"></i> Vienna, Austria</span>
               <span class="hover:text-cyan-400 cursor-pointer transition-colors"><i class="fas fa-envelope mr-2"></i> Kojo Ampia-Addison</span>
               <span class="hover:text-cyan-400 cursor-pointer transition-colors"><i class="fas fa-phone mr-2"></i> +43 676 922 1796</span>
            </div>
            <p class="font-mono text-xs opacity-50">System Version 2026.1.0 • Built with Angular 17 • Deployed on OpenShift</p>
          </footer>

        </div>
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; }
    /* Custom Scrollbar for Webkit */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #0f172a; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #475569; }
    
    .animate-in { animation: fadeIn 0.3s ease-out forwards; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class App {
  currentView = signal('Dashboard');
  avatarError = signal(false);

  // Engagement Form Data
  inquiry = {
    name: '',
    email: '',
    type: 'Architecture',
    message: ''
  };

  experiences = signal<Experience[]>([
    {
      company: 'Bundesrechenzentrum (BRZ)',
      role: 'Software Developer & DevOps Engineer',
      period: '07/2025 - Present',
      status: 'Active',
      description: 'Refactoring core APIs and designing GitOps infrastructure. Implementing OpenTelemetry for full system observability.',
      stack: ['Java 21', 'Spring Boot', 'OpenTelemetry', 'Kubernetes', 'DB2', 'Grafana'],
      metrics: [
        { label: 'API Availability', value: '99.95%', trend: 'up' },
        { label: 'Latency', value: '<50ms', trend: 'stable' },
        { label: 'Deploys/Week', value: '15+', trend: 'up' }
      ]
    },
    {
      company: 'Abofonsa Mobile Health',
      role: 'Lead Architect (Pro-bono)',
      period: '03/2022 - Present',
      status: 'Active',
      description: 'Led development of a Near-Real Time communication brokerage platform for mobile health services.',
      stack: ['JHipster', 'Kafka', 'MongoDB', 'Angular 17', 'Docker'],
      metrics: [
        { label: 'Msg Throughput', value: '5k/sec', trend: 'up' },
        { label: 'Users', value: 'Scaling', trend: 'up' }
      ]
    },
    {
      company: 'Accenture',
      role: 'Senior DevOps Engineer',
      period: '06/2022 - 08/2023',
      status: 'Stable',
      description: 'Application Migration to OpenShift PaaS. Designed custom metrics for SLI/SLO monitoring using PromQL.',
      stack: ['OpenShift', 'Helm', 'Jenkins', 'Prometheus', 'ELK Stack'],
      metrics: [
        { label: 'Migration', value: '100%', trend: 'stable' },
        { label: 'SLO Target', value: 'Met', trend: 'stable' }
      ]
    },
    {
      company: 'Bedrock Insurance',
      role: 'Senior Software Architect',
      period: '08/2020 - 12/2022',
      status: 'Stable',
      description: 'Developed Owasp T10 compliant web application with dashboards for Operations and Business Admin.',
      stack: ['Java 11', 'Microservices', 'Spring Security', 'Angular 10'],
      metrics: [
        { label: 'Security Score', value: 'A+', trend: 'up' }
      ]
    },
    {
      company: 'Austrian Railways (ÖBB)',
      role: 'Monitoring & DevOps Engineer',
      period: '02/2019 - 10/2021',
      status: 'Deprecated', // Job finished
      description: 'Ticketshop Operations Monitoring. Built dashboards using Elastic Stack and customized alert configurations.',
      stack: ['Elasticsearch', 'Grafana', 'OracleDB', 'Angular'],
      metrics: [
        { label: 'Uptime', value: '99.9%', trend: 'stable' }
      ]
    }
  ]);

  projects = signal<Project[]>([
    {
        name: 'Health Brokerage Platform',
        client: 'Abofonsa Mobile Health',
        type: 'Microservices',
        description: 'Near-real time communication brokerage using Kafka streams for mobile health data processing.',
        stack: ['Java 17', 'Kafka', 'MongoDB', 'JHipster', 'Angular 17'],
        status: 'Live',
        architecture: 'Event-Driven'
    },
    {
        name: 'Enterprise GitOps Pipeline',
        client: 'BRZ',
        type: 'DevOps',
        description: 'Infrastructure as Code design and OpenTelemetry integration for federal computing services.',
        stack: ['Kubernetes', 'ArgoCD', 'OpenTelemetry', 'Java 21'],
        status: 'Live',
        architecture: 'Cloud Native'
    },
    {
        name: 'Insurance Portal (OWASP)',
        client: 'Bedrock Insurance',
        type: 'Microservices',
        description: 'Secure policy management dashboards and public facing website compliant with OWASP Top 10 standards.',
        stack: ['Spring Security', 'Angular 10', 'JWT', 'Netflix OSS'],
        status: 'Completed',
        architecture: 'Microservices'
    },
    {
        name: 'OpenShift Cloud Migration',
        client: 'Accenture',
        type: 'Migration',
        description: 'Large-scale migration of legacy applications to OpenShift PaaS with custom SLI/SLO monitoring.',
        stack: ['OpenShift', 'Helm', 'PromQL', 'Groovy'],
        status: 'Completed',
        architecture: 'Hybrid Cloud'
    },
     {
        name: 'Ticketshop Monitoring',
        client: 'ÖBB',
        type: 'DevOps',
        description: 'High-availability monitoring solution for national rail ticketing operations using Elastic Stack.',
        stack: ['Elasticsearch', 'Grafana', 'OracleDB'],
        status: 'Completed',
        architecture: 'Observability'
    },
    {
      name: 'Interconnection Billing',
      client: 'T-Mobile Austria',
      type: 'Monolith',
      description: 'Optimization of routine operations for the Interconnection Billing Process implementation on Mediation Zone.',
      stack: ['Java 6', 'Oracle DB', 'PL/SQL', 'Cognos'],
      status: 'Maintenance',
      architecture: 'Legacy'
    }
  ]);

  docs = signal<Doc[]>([
    {
      id: 'ADR-2024-001',
      title: 'Event-Driven Architecture Strategy',
      type: 'ADR',
      tags: ['Kafka', 'Microservices', 'Abofonsa'],
      lastUpdated: '2024-03-15',
      content: `
# Context
For the Abofonsa Mobile Health Service, we require a near-real-time communication brokerage platform. The current polling mechanism causes latency and database contention.

# Decision
We will implement an Event-Driven Architecture using Apache Kafka.

## Key Components
1. **Producer:** Mobile App Gateways publishing "HealthEvent" topics.
2. **Broker:** Kafka Cluster (3 nodes) for persistence and reliability.
3. **Consumer:** Analytics Service and Alerting Service.

# Consequences
* **Positive:** Latency reduced from seconds to milliseconds. Decoupled services.
* **Negative:** Increased operational complexity (Zookeeper/Kafka management).
* **Mitigation:** Use Managed Kafka or Strimzi Operator on Kubernetes.
      `
    },
    {
      id: 'SEC-POL-003',
      title: 'OWASP Top 10 Mitigation Strategy',
      type: 'Policy',
      tags: ['Security', 'Spring Boot', 'Bedrock'],
      lastUpdated: '2022-11-20',
      content: `
# Policy Statement
All public-facing portals for Bedrock Insurance must comply with OWASP Top 10 standards.

# Implementation Guidelines

## 1. Injection (A03:2021)
* Use Prepared Statements (JPA/Hibernate) for all SQL queries.
* Validate all inputs using a strict whitelist.

## 2. Broken Access Control (A01:2021)
* Implement Role-Based Access Control (RBAC) using Spring Security.
* Enforce object-level authorization (e.g., users can only see their own policies).

## 3. Cryptographic Failures (A02:2021)
* Enforce TLS 1.3 for all traffic.
* Encrypt PII (Personally Identifiable Information) at rest using AES-256.
      `
    },
    {
      id: 'OPS-MAN-002',
      title: 'OpenShift Migration Playbook',
      type: 'Manual',
      tags: ['DevOps', 'OpenShift', 'Accenture'],
      lastUpdated: '2023-06-10',
      content: `
# Overview
Standard operating procedure for migrating legacy Java applications to OpenShift PaaS.

# Phase 1: Containerization
1.  Create \`Dockerfile\` based on \`openjdk:17-slim\`.
2.  Optimize layers (copy dependencies before source).
3.  Add non-root user for security compliance.

# Phase 2: Helm Chart Creation
1.  Define \`Deployment\`, \`Service\`, and \`Route\` resources.
2.  Externalize configurations to \`ConfigMap\` and \`Secret\`.
3.  Implement \`LivenessProbe\` and \`ReadinessProbe\` endpoints.

# Phase 3: Observability
1.  Enable ServiceMonitor for Prometheus scraping.
2.  Verify logs are shipping to ELK stack.
      `
    }
  ]);

  selectedDoc = signal<Doc | null>(null);

  skills: TechSkill[] = [
    // Backend
    { name: 'Java 8/11/17/21', category: 'Backend', level: 100, icon: 'java' },
    { name: 'Spring Boot & Cloud', category: 'Backend', level: 95, icon: 'leaf' },
    { name: 'Microservices', category: 'Backend', level: 90, icon: 'network-wired' },
    { name: 'JHipster', category: 'Backend', level: 90, icon: 'rocket' },
    
    // Frontend
    { name: 'Angular (10-17+)', category: 'Frontend', level: 95, icon: 'angular' },
    { name: 'TypeScript', category: 'Frontend', level: 90, icon: 'code' },
    
    // DevOps
    { name: 'Kubernetes & Helm', category: 'DevOps', level: 95, icon: 'dharmachakra' },
    { name: 'Docker', category: 'DevOps', level: 95, icon: 'docker' },
    { name: 'Jenkins CI/CD', category: 'DevOps', level: 90, icon: 'cogs' },
    { name: 'OpenShift', category: 'DevOps', level: 85, icon: 'cloud' },
    
    // Data
    { name: 'Apache Kafka', category: 'Data', level: 90, icon: 'stream' },
    { name: 'Elasticsearch/ELK', category: 'Data', level: 85, icon: 'search' },
    { name: 'SQL (Postgres/Oracle)', category: 'Data', level: 90, icon: 'database' },
    { name: 'MongoDB', category: 'Data', level: 90, icon: 'leaf' }
  ];

  getSkillsByCategory(cat: string): TechSkill[] {
    return this.skills.filter(s => s.category === cat);
  }

  generatePDF() {
    console.log('Printing PDF...');
    window.print();
  }

  saveSettings() {
    alert('System configuration saved. Restart required for environment variables to take effect.');
  }

  submitInquiry() {
    // Create new project from inquiry
    const newProject: Project = {
      name: `${this.inquiry.type} Strategy`,
      client: this.inquiry.name,
      type: this.inquiry.type as any,
      description: this.inquiry.message,
      stack: ['Planning', 'TBD'],
      status: 'Pending',
      architecture: 'Under Review'
    };

    // Add to project list
    this.projects.update(p => [newProject, ...p]);
    
    // Alert user
    alert(`Contract Initialized for ${this.inquiry.name}. Deployment pipeline started.`);

    // Reset Form
    this.inquiry = {
      name: '',
      email: '',
      type: 'Architecture',
      message: ''
    };
    
    // Redirect to Projects view to see the "deployment"
    this.currentView.set('Projects');
  }
}