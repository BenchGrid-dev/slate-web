"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronDown, FileText, Folder, Globe2, LayoutGrid, Mail, Monitor, MousePointer2, Network, Search, Star, StickyNote, Terminal, Volume2 } from "lucide-react";
import styles from "./desktop-demo.module.css";

type Beat = { target: string; message: string; click?: boolean; drag?: boolean };
type Scene = { name: string; short: string; icon: typeof Folder; request: string; title: string; result: string; beats: Beat[] };
const SCENES: Scene[] = [
  { name: "Organize the desktop", short: "Tidy up", icon: Folder, request: "Organize my desktop. Put the loose files into folders.", title: "Desktop — Files", result: "A clean desktop. 6 files sorted into 3 folders.", beats: [
    { target: "files-title", message: "Taking a look at the files on your desktop." },
    { target: "file-0", message: "These two documents belong together.", click: true },
    { target: "folder-docs", message: "Moving the documents into Documents.", drag: true },
    { target: "file-2", message: "Next, the photos and design references.", click: true },
    { target: "folder-images", message: "Giving your images a home.", drag: true },
    { target: "file-4", message: "Just the archives left to put away.", click: true },
    { target: "folder-archives", message: "Moving the archives. Almost there.", drag: true },
    { target: "folder-docs", message: "Everything is where it should be.", click: true },
    { target: "rest", message: "A clean desktop. 6 files sorted into 3 folders." },
  ] },
  { name: "Catch up on your inbox", short: "Inbox", icon: Mail, request: "Check my inbox and pull out what needs my attention.", title: "Inbox — Mail", result: "You’re caught up. 2 things to follow up on. Nothing sent.", beats: [
    { target: "mail-inbox", message: "Checking the latest messages.", click: true },
    { target: "mail-0", message: "Reading Maya’s note about the design review.", click: true },
    { target: "mail-star", message: "Flagging the design review for your attention.", click: true },
    { target: "mail-back", message: "Back to your inbox for the next message.", click: true },
    { target: "mail-1", message: "Checking the updated project brief.", click: true },
    { target: "mail-star", message: "The brief needs your feedback, too.", click: true },
    { target: "mail-back", message: "Putting together a short catch-up.", click: true },
    { target: "mail-summary", message: "Two follow-ups. A little less to keep in your head.", click: true },
    { target: "rest", message: "You’re caught up. 2 things to follow up on. Nothing sent." },
  ] },
  { name: "Find a little inspiration", short: "Research", icon: Globe2, request: "Find a guide to native wildflowers for my garden notes.", title: "Research — Mozilla Firefox", result: "Found a useful reference and saved it to your reading list.", beats: [
    { target: "browser-search", message: "Opening a search in Firefox.", click: true },
    { target: "browser-search", message: "Looking for a practical guide to native wildflowers." },
    { target: "browser-go", message: "Let’s see what’s out there.", click: true },
    { target: "result-0", message: "This field guide looks like a good place to start.", click: true },
    { target: "article-title", message: "Reading the guide and checking what it covers." },
    { target: "article-more", message: "A simple starting point: choose plants native to your region.", click: true },
    { target: "bookmark", message: "Saving the reference for later.", click: true },
    { target: "bookmark", message: "Added to your reading list. Ready when you are." },
    { target: "rest", message: "Found a useful reference and saved it to your reading list." },
  ] },
  { name: "Make room for focus", short: "Workspace", icon: LayoutGrid, request: "Put my browser and terminal side by side, ready to work.", title: "Workspace — Slate", result: "Browser on the left. Terminal on the right. Your notes untouched.", beats: [
    { target: "arrange-browser", message: "Finding your browser and terminal windows.", click: true },
    { target: "arrange-browser", message: "Taking the browser by its title bar.", click: true },
    { target: "snap-left", message: "Moving Firefox to the left side.", drag: true },
    { target: "arrange-terminal", message: "Now for your terminal.", click: true },
    { target: "snap-right", message: "Making space for the terminal on the right.", drag: true },
    { target: "terminal-input", message: "Checking that the workspace is ready.", click: true },
    { target: "terminal-input", message: "Your shell is ready. Your notes are right where you left them." },
    { target: "arrange-browser", message: "A little more room to think." },
    { target: "rest", message: "Browser on the left. Terminal on the right. Your notes untouched." },
  ] },
];
const BEAT_MS = 1800;
const SCENE_MS = SCENES[0].beats.length * BEAT_MS + 2800;
const FILES = ["project-brief.pdf", "meeting-notes.md", "moodboard.png", "garden.jpg", "assets.zip", "backup.tar"];
const MAIL = [
  { from: "Maya Chen", initials: "MC", title: "A fresh pair of eyes?", preview: "The new designs are ready for a look.", time: "9:38", body: "Hey! The new desktop designs are ready. Could you take a look before our review on Thursday? I’d love your thoughts on the little details.", sign: "Thanks, Maya" },
  { from: "Alex Rivera", initials: "AR", title: "Project brief · updated", preview: "A few small changes before we get started.", time: "9:12", body: "I’ve updated the project brief with the new milestones. When you have a moment, please add your feedback to the scope section. No rush — tomorrow works.", sign: "Cheers, Alex" },
  { from: "The Field Notes", initials: "FN", title: "Something worth slowing down for", preview: "This week: making space for good ideas.", time: "8:45", body: "A few quiet ideas for your week. Take a walk, write something down, and leave a little space for the unexpected.", sign: "The Field Notes" },
];

function Cursor({ agent = false }: { agent?: boolean }) {
  return <><svg viewBox="0 0 24 30" aria-hidden="true"><path d="M2 2 21 17 12 18 8 27Z" fill={agent ? "#b9e6c5" : "#152d2a"} stroke={agent ? "#527f64" : "#f0faf5"} strokeWidth="1.5" strokeLinejoin="round" /></svg><span>{agent ? "Slate" : "You"}</span></>;
}

export default function DesktopDemo() {
  const [scene, setScene] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const userCursorRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [agentPoint, setAgentPoint] = useState({ x: 53, y: 76 });
  const [noteTab, setNoteTab] = useState("notes");
  const [note, setNote] = useState("A little space for my thoughts.\n\nPlan a garden.\nMake something useful.\nLeave room for a good idea.");
  const [checked, setChecked] = useState([true, false, false]);
  const [notePosition, setNotePosition] = useState({ x: 66, y: 57 });
  const [preview, setPreview] = useState<string | null>(null);
  const dragRef = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const s = SCENES[scene];
  const beatIndex = Math.min(Math.floor(elapsed / BEAT_MS), s.beats.length - 1);
  const beat = s.beats[beatIndex];
  const settled = elapsed % BEAT_MS >= 850 || elapsed >= s.beats.length * BEAT_MS;
  const phase = beatIndex - (settled ? 0 : 1);
  const complete = phase >= s.beats.length - 1;
  const playing = !reducedMotion;
  const active = playing && visible;
  const openedMail = phase >= 4 && phase < 6 ? 1 : phase >= 1 && phase < 3 ? 0 : null;

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { setReducedMotion(media.matches); progressRef.current = media.matches ? SCENE_MS : 0; setElapsed(progressRef.current); };
    update(); media.addEventListener("change", update);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.intersectionRatio >= .15), { threshold: .15 });
    if (stageRef.current) observer.observe(stageRef.current);
    return () => { observer.disconnect(); media.removeEventListener("change", update); };
  }, []);

  useEffect(() => {
    if (!active) return;
    let last = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const delta = Math.min(now - last, 200); last = now;
      if (document.hidden) return;
      progressRef.current += delta;
      if (progressRef.current >= SCENE_MS) {
        progressRef.current = 0;
        setScene(current => (current + 1) % SCENES.length);
      }
      setElapsed(progressRef.current);
    }, 80);
    return () => clearInterval(timer);
  }, [active]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const move = () => {
      const target = stage.querySelector<HTMLElement>(`[data-agent-target="${beat.target}"]`);
      if (!target) return;
      const rect = stage.getBoundingClientRect(), point = target.getBoundingClientRect();
      setAgentPoint({ x: (point.left + point.width * .55 - rect.left) / rect.width * 100, y: (point.top + point.height * .5 - rect.top) / rect.height * 100 });
    };
    move();
    const observer = new ResizeObserver(move); observer.observe(stage);
    return () => observer.disconnect();
  }, [scene, beat.target, beatIndex]);

  function chooseScene(index: number) { progressRef.current = reducedMotion ? SCENE_MS : 0; setElapsed(progressRef.current); setScene(index); }
  function moveUser(event: ReactPointerEvent<HTMLDivElement>) {
    const stage = stageRef.current, cursor = userCursorRef.current;
    if (!stage || !cursor || event.pointerType === "touch") return;
    const rect = stage.getBoundingClientRect();
    cursor.style.left = `${event.clientX - rect.left}px`;
    cursor.style.top = `${event.clientY - rect.top}px`;
    stage.dataset.pointer = "true";
    if (dragRef.current) {
      setNotePosition({ x: Math.max(1, Math.min(67, dragRef.current.left + (event.clientX - dragRef.current.x) / rect.width * 100)), y: Math.max(8, Math.min(65, dragRef.current.top + (event.clientY - dragRef.current.y) / rect.height * 100)) });
    }
  }
  function startDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button")) return;
    dragRef.current = { x: event.clientX, y: event.clientY, left: notePosition.x, top: notePosition.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function showPreview(name: string) { setPreview(name); setNoteTab("preview"); }

  return <div className={styles.demo}>
    <div className={styles.frame}>
      <div ref={stageRef} className={styles.stage} data-scene={scene} data-reduced={reducedMotion} onPointerMove={moveUser} onPointerLeave={() => { if (stageRef.current) stageRef.current.dataset.pointer = "false"; userCursorRef.current?.classList.remove(styles.pressed); }} onPointerDown={() => userCursorRef.current?.classList.add(styles.pressed)} onPointerUp={() => { dragRef.current = null; userCursorRef.current?.classList.remove(styles.pressed); }} onPointerCancel={() => { dragRef.current = null; userCursorRef.current?.classList.remove(styles.pressed); }}>
        <div className={styles.osbar}><div><span className={styles.diamond}>◆</span><span className={styles.workspace}>1</span><span className={styles.appTitle}>{s.title}</span></div><span className={styles.clock}>Tue 29 Sep <b>09:41</b></span><div><Network /><Volume2 /><span className={`${styles.osStatus} ${!complete && playing ? styles.working : ""}`}>◆ {complete ? "Slate" : playing ? "working" : "paused"}</span></div></div>
        <div className={styles.prompt}><div className={styles.promptPill}><span className={`${styles.diamond} ${!complete && active ? styles.pulse : ""}`}>◆</span><span>Ask Slate</span><small>{complete ? "auto" : `${playing ? "working" : "paused"} · ${Math.floor(elapsed / 1000)}s`}</small><ChevronDown /></div><div className={styles.response}><p>{s.request}</p><div>{complete ? s.result : beat.message}</div><small>{complete ? <><Check /> Done · you never lost your place.</> : <><span className={styles.activityDot} /> {beat.drag ? "Moving" : beat.click ? "Interacting" : "Reading"} · {beatIndex + 1} of {s.beats.length}</>}</small></div></div>

        {scene === 0 && <div className={`${styles.app} ${styles.filesApp}`}><div className={styles.windowTitle} data-agent-target="files-title"><Folder /><span>Desktop</span><span className={styles.windowMarks}>− &nbsp; □ &nbsp; ×</span></div><div className={styles.fileBrowser}><aside><span>PLACES</span><div><Monitor /> Home</div><div className={styles.sidebarSelected}><Monitor /> Desktop</div><div><Folder /> Documents</div><div><FileText /> Recent</div><small>6 files. A fresh start.</small></aside><div className={styles.fileContents}><div className={styles.path}><ArrowLeft /><span>Home</span><ChevronDown /><b>Desktop</b><Search /></div><div className={styles.folders}>{["Documents", "Images", "Archives"].map((folder, i) => <button key={folder} data-agent-target={`folder-${["docs", "images", "archives"][i]}`} onClick={() => showPreview(folder)} className={phase >= 2 + i * 2 ? styles.folderFilled : ""}><Folder fill="currentColor" /><span>{folder}</span><small>{phase >= 2 + i * 2 ? "2 files" : "Empty"}</small></button>)}</div><div className={styles.looseFiles}>{FILES.map((file, i) => <button key={file} data-agent-target={`file-${i}`} onClick={() => showPreview(file)} className={`${phase >= 2 + Math.floor(i / 2) * 2 ? styles.fileMoved : ""} ${phase === 1 + Math.floor(i / 2) * 2 ? styles.fileSelected : ""}`}><FileText /><span>{file}</span></button>)}</div><div className={styles.filesFooter}>{phase >= 6 ? <><Check /> Everything in its place.</> : "A little order is on the way."}</div></div></div></div>}

        {scene === 1 && <div className={`${styles.app} ${styles.mailApp}`}><div className={styles.windowTitle}><Mail /><span>Mail</span><span className={styles.windowMarks}>− &nbsp; □ &nbsp; ×</span></div><div className={styles.mailBody}><aside><b>Good morning.</b><div data-agent-target="mail-inbox" className={styles.sidebarSelected}><Mail /> Inbox <span>3</span></div><div><Star /> Starred <span>{phase >= 5 ? 2 : phase >= 2 ? 1 : 0}</span></div><div><FileText /> Drafts</div><small>YOUR MAIL, A LITTLE CALMER.</small></aside><div className={styles.mailContent}>
          <div className={styles.mailToolbar}><span data-agent-target="mail-back"><ArrowLeft /> {openedMail !== null ? "Inbox" : "Your inbox"}</span><span data-agent-target="mail-star"><Star fill={(openedMail === 0 && phase >= 2) || (openedMail === 1 && phase >= 5) ? "#e8c98e" : "none"} /></span></div>
          {MAIL.map((mail, i) => <button key={mail.from} data-agent-target={`mail-${i}`} className={`${styles.mailRow} ${openedMail !== null ? styles.hiddenMail : ""}`} onClick={() => showPreview(`${mail.from}: ${mail.title}`)}><span className={styles.avatar}>{mail.initials}</span><span><b>{mail.from}</b><strong>{mail.title}</strong><small>{mail.preview}</small></span><span>{mail.time}{((i === 0 && phase >= 2) || (i === 1 && phase >= 5)) && <Star fill="#e8c98e" />}</span></button>)}
          {openedMail !== null && <div className={styles.openMail}><span className={styles.mailLabel}>A NOTE FROM {MAIL[openedMail].from.toUpperCase()}</span><h4>{MAIL[openedMail].title}</h4><p>{MAIL[openedMail].body}</p><span>{MAIL[openedMail].sign}</span></div>}
          <div className={`${styles.mailSummary} ${phase >= 7 ? styles.summaryReady : ""}`} data-agent-target="mail-summary"><span>◆ Your quick catch-up</span>{phase >= 7 ? <><p><Check /> Review Maya’s designs before Thursday.</p><p><Check /> Add feedback to Alex’s project brief.</p><small>Read and flagged. Nothing sent.</small></> : <p>A short summary, coming right up.</p>}</div>
        </div></div></div>}

        {scene === 2 && <div className={`${styles.app} ${styles.browserApp}`}><div className={styles.windowTitle}><Globe2 /><span>{phase >= 3 ? "The quiet garden — Field guide" : "New tab — Firefox"}</span><span className={styles.windowMarks}>− &nbsp; □ &nbsp; ×</span></div><div className={styles.addressBar}><ArrowLeft /><ArrowRight /><span><Search />{phase >= 3 ? "fieldnotes.example / native-wildflowers" : "Search the web"}</span><span data-agent-target="bookmark"><Star fill={phase >= 6 ? "#e8c98e" : "none"} /></span></div><div className={styles.browserContent}>
          {phase < 3 ? <><span className={styles.searchGreeting}>A world of little discoveries.</span><div className={styles.searchBox} data-agent-target="browser-search"><Search /><span>{phase >= 1 ? "native wildflowers for a small garden".slice(0, Math.max(0, Math.floor((elapsed - 2600) / 42))) : "What are you curious about?"}</span><span data-agent-target="browser-go"><ArrowRight /></span></div>{phase >= 2 && <div className={styles.searchResults}><span>FOUND SOMETHING GOOD</span><div data-agent-target="result-0"><small>FIELD NOTES · A PRACTICAL GUIDE</small><h4>A little garden, a little more wild.</h4><p>A beginner’s guide to choosing native wildflowers.</p></div><div><small>THE EVERYDAY GARDEN</small><h4>Make room for the pollinators.</h4></div></div>}</> : <div className={styles.article}><div className={styles.articleImage} /><small>FIELD NOTES / IN THE GARDEN</small><h4 data-agent-target="article-title">A little garden,<br />a little more wild.</h4><p>Start small. Choose flowers native to your region, leave a corner for pollinators, and let the seasons lead the way.</p><div data-agent-target="article-more" className={styles.articleMore}>{phase >= 5 ? "01 / Find your light.  02 / Know your soil.  03 / Plant locally." : "A few things to grow on →"}</div>{phase >= 6 && <span className={styles.savedBookmark}><Check /> Saved to your reading list</span>}</div>}
        </div></div>}

        {scene === 3 && <div className={styles.arrangeArea}><span className={styles.snapLeft} data-agent-target="snap-left" /><span className={styles.snapRight} data-agent-target="snap-right" /><div className={`${styles.arrangeBrowser} ${phase >= 2 ? styles.browserSnapped : ""}`}><div className={styles.windowTitle} data-agent-target="arrange-browser"><Globe2 /><span>Firefox</span><span className={styles.windowMarks}>− &nbsp; □</span></div><div className={styles.addressBar}><span>slate.local / a-fresh-start</span></div><div className={styles.workspacePage}><span>ROOM TO THINK</span><h4>A fresh<br /><em>perspective.</em></h4><p>The best tools make space for what matters.</p><div /><div /><div /></div></div><div className={`${styles.arrangeTerminal} ${phase >= 4 ? styles.terminalSnapped : ""}`}><div className={styles.windowTitle} data-agent-target="arrange-terminal"><Terminal /><span>Terminal</span><span className={styles.windowMarks}>− &nbsp; □</span></div><div className={styles.terminalBody}><p>Welcome back.</p><span>~/workspace</span><div data-agent-target="terminal-input"><b>❯</b> {phase >= 5 ? "pwd" : ""}<i /></div>{phase >= 6 && <><p>/home/you/workspace</p><div><b>❯</b> <i /></div></>}</div></div></div>}

        <div className={styles.restTarget} data-agent-target="rest" />
        <div className={styles.userWindow} style={{left:`${notePosition.x}%`,top:`${notePosition.y}%`}}><div className={styles.userTitle} onPointerDown={startDrag} onLostPointerCapture={() => { dragRef.current = null; }} onKeyDown={e => { const move: Record<string, [number,number]> = {ArrowLeft:[-2,0],ArrowRight:[2,0],ArrowUp:[0,-2],ArrowDown:[0,2]}; if(move[e.key]) { e.preventDefault(); const [x,y]=move[e.key];setNotePosition(p=>({x:Math.max(1,Math.min(67,p.x+x)),y:Math.max(8,Math.min(65,p.y+y))})); }}} tabIndex={0} aria-label="Move your notes window with arrow keys or drag"><StickyNote /><span>Your little corner</span><span className={styles.yourSeat}>YOUR SEAT</span></div><div className={styles.noteTabs}><button aria-pressed={noteTab === "notes"} onClick={() => setNoteTab("notes")}>Notes</button><button aria-pressed={noteTab === "list"} onClick={() => setNoteTab("list")}>My day</button>{preview && <button aria-pressed={noteTab === "preview"} onClick={() => setNoteTab("preview")}>Preview</button>}</div>{noteTab === "notes" ? <textarea aria-label="Your notes — type while Slate works" spellCheck={false} value={note} onChange={event => setNote(event.target.value)} /> : noteTab === "list" ? <div className={styles.checklist}>{["Make a little space", "Sketch the next idea", "Go for a walk"].map((text,i) => <label key={text}><input type="checkbox" checked={checked[i]} onChange={() => setChecked(value => value.map((v,j)=>i===j?!v:v))} /><span>{text}</span></label>)}</div> : <div className={styles.filePreview}><FileText /><b>{preview}</b><p>A little preview, just for you.</p><button onClick={()=>setNoteTab("notes")}>Back to my notes <ArrowRight /></button></div>}<div className={styles.noteFooter}><span className={styles.userDot} /> Yours to click, type, and move.<span>Local demo</span></div></div>

        <div className={`${styles.agentCursor} ${beat.click && settled && !complete ? styles.clicking : ""}`} aria-hidden="true" style={{left:`${agentPoint.x}%`,top:`${agentPoint.y}%`}}><Cursor agent />{scene === 0 && beat.drag && !settled && <div className={styles.dragFiles}><FileText /><span>2 files</span></div>}<i key={`${scene}-${beatIndex}`} /></div>
        <div ref={userCursorRef} className={styles.userCursor} aria-hidden="true"><Cursor /></div>
        
      </div>
    </div>
    <div className={styles.playback}><div className={styles.sceneTabs} role="group" aria-label="Desktop demo scenes">{SCENES.map((item,index)=><button key={item.short} aria-label={item.name} aria-pressed={scene===index} onClick={()=>chooseScene(index)} className={scene===index?styles.activeScene:""}><item.icon /><span>{item.short}</span>{scene===index&&<i style={{width:`${elapsed / SCENE_MS * 100}%`}} />}</button>)}</div></div>
    <div className={styles.demoLegend}><span><span className={styles.legendCursor} aria-hidden="true"><Cursor agent /></span> Slate works at its own pace.</span><span><MousePointer2 /> Your cursor, your corner. Try the notes.</span></div>
    <span className="sr-only" role="status">{s.name}. {complete?s.result:playing?"Agent working. Your notes remain interactive.":"Demo paused."}</span>
  </div>;
}
