import styles from './Sidebar.module.css';
import { NavLink } from "react-router-dom";

interface Project { id: string; name: string; color: string; }
interface SidebarProps {
    projects: Project[];
    isOpen: boolean;
    onRename?: (p: Project) => void;
    onDelete?: (id: string) => void;
}

export default function Sidebar({ projects, isOpen, onRename, onDelete }: SidebarProps) {
    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
            <h2 className={styles.title}>Mes Projets</h2>
            <ul className={styles.list}>
                {projects.map(p => (
                    <li key={p.id} className={styles.itemWrapper}>
                        <NavLink
                            to={`/projects/${p.id}`}
                            className={({ isActive }) =>
                                `${styles.item} ${isActive ? styles.active : ''}`
                            }
                        >
                            <span className={styles.dot} style={{ background: p.color }} />
                            {p.name}
                        </NavLink>
                        <div className={styles.itemActions}>
                            <button onClick={() => onRename?.(p)} className={styles.actionBtn}>✎</button>
                            <button onClick={() => onDelete?.(p.id)} className={styles.actionBtn}>🗑</button>
                        </div>
                    </li>
                ))}
            </ul>
        </aside>
    );
}