import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { getProjects } from "../services/projectApi";
import "./ProjectsPage.css";

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    async function loadProjects() {
      const data = await getProjects();
      const formattedData = data.map((p) => ({
        id: p.project_id,
        name: p.title,
        userName: p.user_name,
        category: p.category,
        budget: `₹${Number(p.budget).toLocaleString("en-IN")}`,
        deadline: new Date(p.deadline).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        status:
          p.status.charAt(0).toUpperCase() +
          p.status.slice(1).replace("_", " "),
        description: p.description,
      }));
      setProjects(formattedData);
    }

    loadProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase()) ||
      project.category.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      project.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-mark">R</span>
          <span>ReverseMarket</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className="sidebar-link">
            <span>▦</span> Dashboard
          </NavLink>

          <NavLink to="/projects" className="sidebar-link">
            <span>▤</span> Projects
          </NavLink>

          <a href="/dashboard#requirements" className="sidebar-link">
            <span>☷</span> My Requirements
          </a>

          <NavLink to="/settings" className="sidebar-link">
            <span>⚙</span> Settings
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <span className="help-icon">?</span>
            <div>
              <strong>Need help?</strong>
              <p>Explore how ReverseMarket works.</p>
            </div>
          </div>

          <div className="profile-card">
            <div className="avatar">S</div>
            <div className="profile-info">
              <strong>Sudharsan</strong>
              <span>Workspace Member</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="dashboard-main projects-page-main">
        <header className="topbar">
          <div>
            <span className="breadcrumb-muted">Workspace</span>
            {" / "}
            <strong>Projects</strong>
          </div>

          <div className="workspace-status">
            <span className="status-dot"></span>
            Demo Workspace
          </div>
        </header>

        <section className="projects-content">
          <div className="projects-heading">
            <div>
              <span className="workspace-label">YOUR WORKSPACE</span>
              <h1>Projects</h1>
              <p>
                Discover projects, review requirements, and find the right
                opportunity.
              </p>
            </div>
          </div>

          <div className="project-search-row">
            <div className="project-search">
              <span className="search-icon">⌕</span>
              <input
                type="search"
                placeholder="Search projects by name or description..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search projects"
              />
              {search && (
                <button
                  className="clear-search"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            <div className="project-filter">
              <span>Filter:</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter projects by status"
              >
                <option value="All">All Projects</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Draft">Draft</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="project-results-heading">
            <strong>Available Projects</strong>
            <span>
              Showing {filteredProjects.length} of {projects.length} projects
            </span>
          </div>

          <div className="project-list">
            {filteredProjects.map((project) => (
              <article className="project-listing" key={project.id}>
                <div className="project-listing-top">
                  <div className="project-title-group">
                    <h2>{project.name}</h2>
                    <span
                      className={`project-status status-${project.status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <button
                    className="project-action"
                    onClick={() =>
                      setSelectedProject(
                        selectedProject === project.id ? null : project.id,
                      )
                    }
                  >
                    {selectedProject === project.id
                      ? "Hide Details"
                      : "View Details"}
                  </button>
                </div>

                <div className="project-meta">
                  <div>
                    <span className="meta-label">Client</span>
                    <strong>{project.userName}</strong>
                  </div>
                  <div>
                    <span className="meta-label">Budget</span>
                    <strong>{project.budget}</strong>
                  </div>
                  <div>
                    <span className="meta-label">Deadline</span>
                    <strong>{project.deadline}</strong>
                  </div>
                  <div>
                    <span className="meta-label">Category</span>
                    <strong>{project.category}</strong>
                  </div>
                </div>

                <p className="project-description">{project.description}</p>

                {selectedProject === project.id && (
                  <div className="project-expanded-details">
                    <strong>Project details</strong>
                    <p>{project.description}</p>
                    <p>
                      <strong>Current status:</strong> {project.status}
                    </p>
                    <p>
                      <strong>Category:</strong> {project.category}
                    </p>
                  </div>
                )}

                <div className="project-listing-footer">
                  <span>
                    <span className="proposal-dot"></span>
                    Posted by {project.userName}
                  </span>
                  <button
                    className="project-text-action"
                    onClick={() =>
                      setSelectedProject(
                        selectedProject === project.id ? null : project.id,
                      )
                    }
                  >
                    {selectedProject === project.id
                      ? "Show less ↑"
                      : "More details →"}
                  </button>
                </div>
              </article>
            ))}

            {filteredProjects.length === 0 && (
              <div className="projects-empty-state">
                <span>⌕</span>
                <h3>No projects found</h3>
                <p>Try another search term or choose a different status.</p>
                <button
                  className="project-text-action"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                  }}
                >
                  Clear search and filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default ProjectsPage; // wait export default ProjectsPage
