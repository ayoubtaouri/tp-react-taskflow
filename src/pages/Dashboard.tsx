import { useState } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import useProjects from '../hooks/useProject';
//import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import ProjectForm from '../components/ProjectForm';
import styles from './Dashboard.module.css';
//import HeaderMUI from "../components/HeaderMUI.tsx";
import HeaderBS from "../components/HeaderBS.tsx";

export default function Dashboard() {
    const { state: authState, dispatch } = useAuth();

    const {
        projects,
        columns,
        loading,
        error,
        addProject,
        renameProject,
        deleteProject
    } = useProjects();

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showForm, setShowForm] = useState(false);

    if (loading) return <div className={styles.loading}>Chargement...</div>;

    return (
        <div className={styles.layout}>
            <HeaderBS
                title="TaskFlow"
                onMenuClick={() => setSidebarOpen(p => !p)}
                userName={authState.user?.name}
                onLogout={() => dispatch({ type: 'LOGOUT' })}
            />

            <div className={styles.body}>
                <Sidebar
                    projects={projects}
                    isOpen={sidebarOpen}
                    onRename={renameProject}
                    onDelete={deleteProject}
                />

                <div className={styles.content}>
                    <div className={styles.toolbar}>
                        {error && <div className={styles.error}>{error}</div>}

                        {!showForm ? (
                            <button
                                className={styles.addBtn}
                                onClick={() => setShowForm(true)}
                            >
                                + Nouveau projet
                            </button>
                        ) : (
                            <ProjectForm
                                submitLabel="Créer"
                                onSubmit={(name, color) => {
                                    addProject(name, color);
                                }}
                                onCancel={() => setShowForm(false)}
                            />
                        )}
                    </div>

                    <MainContent columns={columns} />
                </div>
            </div>
        </div>
    );
}