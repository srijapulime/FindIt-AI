
import { useState } from 'react';

function Home() {
  const [search, setSearch] = useState('');

  const categories = [
    { icon: '🎒', name: 'Bags & Backpacks' },
    { icon: '📱', name: 'Electronics' },
    { icon: '🔑', name: 'Keys & Cards' },
    { icon: '📚', name: 'Books & Others' },
  ];

  return (
    <main className="home-page">
      <section className="hero">
        <p className="eyebrow">AI-POWERED LOST & FOUND</p>

        <h1>
          Lost something?
          <br />
          <span>Let's find it together.</span>
        </h1>

        <p className="hero-description">
          Find your lost belongings with smart matching.
          Report lost or found items and help reunite
          people with their belongings.
        </p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search for a lost item..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <button
            onClick={() =>
              alert(`Search for: ${search || 'any item'}`)
            }
          >
            Search Items
          </button>
        </div>

        <div className="hero-actions">
          <button
            className="report-btn"
            onClick={() => alert('Report Lost Item page coming next!')}
          >
            + Report Lost Item
          </button>

          <button
            className="login-btn"
            onClick={() => alert('Browse Items page coming next!')}
          >
            Browse Items
          </button>
        </div>

        <div className="hero-illustration">
          <span className="big-emoji">🔎</span>
          <div className="match-card">
            <span>✨</span>
            <div>
              <strong>Smart Matching</strong>
              <p>AI helps find matching items</p>
            </div>
          </div>
        </div>
      </section>

      <section className="items-section">
        <p className="eyebrow">EXPLORE CATEGORIES</p>
        <h2>What are you looking for?</h2>
        <p>Choose a category to get started.</p>

        <div className="category-grid">
          {categories.map((category) => (
            <button
              className="category-card"
              key={category.name}
              onClick={() => alert(`${category.name} selected`)}
            >
              <span className="category-icon">{category.icon}</span>
              <strong>{category.name}</strong>
              <span className="card-arrow">→</span>
            </button>
          ))}
        </div>
      </section>

      <section className="how-section">
        <p className="eyebrow">SIMPLE AND EASY</p>
        <h2>How FindIt AI works</h2>

        <div className="steps-grid">
          <article className="step-card">
            <span>📝</span>
            <h3>1. Report an Item</h3>
            <p>Share the details of your lost or found item.</p>
          </article>

          <article className="step-card">
            <span>🤖</span>
            <h3>2. Smart Matching</h3>
            <p>Find potentially matching items with AI.</p>
          </article>

          <article className="step-card">
            <span>🎉</span>
            <h3>3. Get Reunited</h3>
            <p>Connect with the owner and recover the item.</p>
          </article>
        </div>
      </section>
    </main>
  );
}

export default Home;
