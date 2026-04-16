import styles from './MainContent.module.css';

interface Column { id: string; title: string; tasks: string[]; }
interface MainContentProps { columns: Column[]; }

export default function MainContent({ columns }: MainContentProps) {
    return (
        <main className={styles.main}>
            <header className={styles.boardHeader}>
                <div className={styles.breadcrumb}>
                    <span>Projets</span>
                    <span>/</span>
                    <span className={styles.active}>Tableau de bord</span>
                </div>
                <div className={styles.actions}>
                    <button className={styles.actionBtn}>Filtres</button>
                    <button className={styles.actionBtn}>Partager</button>
                </div>
            </header>
            <div className={styles.board}>
                {columns.map(col => (
                    <div key={col.id} className={styles.column}>
                        <h3 className={styles.colTitle}>{col.title} ({col.tasks.length})</h3>
                        {col.tasks.map((task, i) => (
                            <div key={i} className={styles.card}>{task}</div>
                        ))}
                        <button className={styles.addTask}>
                            <span>+</span> Ajouter une tâche
                        </button>
                    </div>
                ))}
            </div>
        </main>
    );
}