import { useState, useLayoutEffect, useEffect, useRef } from 'react';
export default function Tooltip() {
 const [position, setPosition] = useState({ top: 0, left: 0 });
 const [useLayout, setUseLayout] = useState(false);
 const buttonRef = useRef<HTMLButtonElement>(null);
 // Version useEffect — flash visible
 useEffect(() => {
 if (useLayout) return;
 if (buttonRef.current) {
 const rect = buttonRef.current.getBoundingClientRect();
 setPosition({ top: rect.bottom + 8, left: rect.left });
 }
 }, [useLayout]);
 // Version useLayoutEffect — pas de flash
 useLayoutEffect(() => {
 if (!useLayout) return;
 if (buttonRef.current) {
 const rect = buttonRef.current.getBoundingClientRect();
 setPosition({ top: rect.bottom + 8, left: rect.left });
 }
 }, [useLayout]);
 return (
 <div style={{ padding: '2rem' }}>
 <button onClick={() => {
 setPosition({ top: 0, left: 0 });
 setUseLayout(prev => !prev);
 }}>
 Basculer : {useLayout ? 'useLayoutEffect' : 'useEffect'}
 </button>
 <br /><br />
 <button ref={buttonRef}>Survolez-moi</button>
 <div style={{
 position: 'fixed',
 top: position.top,
 left: position.left,
 background: position.top === 0 ? 'red' : '#333',
 color: 'white',
 padding: '0.5rem 1rem',
 borderRadius: '6px',
 transition: 'none',
 }}>
 {position.top === 0 ? '⚡ FLASH (0,0)' : 'Info-bulle positionnée !'}
 </div>
 </div>
 );
}
