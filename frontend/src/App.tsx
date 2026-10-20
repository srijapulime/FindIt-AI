
import { useState, useEffect, type FormEvent } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import './App.css';
import { getItems, getItemsFromDatabase, saveItemToDatabase } from './items';

function ItemPhoto({
  photoData,
  name,
}: {
  photoData?: string;
  name: string;
}) {
  if (!photoData) return null;

  return (
    <img
      src={photoData}
      alt={name}
      className="item-preview"
    />
  );
}

function BrowseItems() {
  const [items, setItems] = useState<ReturnType<typeof getItems>>([]);
  useEffect(() => {
    getItemsFromDatabase()
     .then((data) => setItems(data))
     .catch((error) => {
      console.error('Error loading items:', error);
    });
}, []);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === 'All' || item.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="inner-page">
      <h1>Browse Items 🔎</h1>
      <p>Search for lost and found belongings.</p>

      <input
        type="text"
        placeholder="Search item name or location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="All">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Bags & Backpacks">Bags & Backpacks</option>
        <option value="Keys & Cards">Keys & Cards</option>
        <option value="Books">Books</option>
        <option value="Other">Other</option>
      </select>

      <button
        type="button"
        className="report-btn"
        onClick={async () => {
  try {
    const data = await getItemsFromDatabase();
    setItems(data);
  } catch (error) {
    console.error('Error refreshing items:', error);
    alert('Unable to refresh items. Please check whether the backend is running.');
  }
}}
      >
        Refresh Items
      </button>

      <div className="dashboard-card">
        <h3>Available Items: {filteredItems.length}</h3>

        {filteredItems.length === 0 ? (
          <p>No items found. Try another search or report an item.</p>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id}>
              <hr />
              <h3>
                {item.type === 'lost' ? '🔍 Lost Item' : '🎒 Found Item'}
              </h3>
              <h4>{item.name}</h4>
              <ItemPhoto photoData={item.photoData} name={item.name} />
              <p>Category: {item.category}</p>
              <p>Location: {item.location}</p>
              <p>Date: {item.date}</p>
              <p>Description: {item.description}</p>

              {item.photoName && !item.photoData && (
                <p>
                  Old report photo: {item.photoName}. Upload the photo again
                  to preview it.
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function ReportLost() {
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const data = new FormData(form);
    const photo = data.get('photo');
    let photoData = '';

    if (photo instanceof File && photo.size > 0) {
      if (!photo.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }

      try {
        photoData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error('Unable to read photo'));
          reader.readAsDataURL(photo);
        });
      } catch {
        alert('Unable to read the photo. Please choose another image.');
        return;
      }
    }

    try {
      await saveItemToDatabase({
        id: crypto.randomUUID(),
        type: 'lost',
        name: String(data.get('name') || ''),
        category: String(data.get('category') || ''),
        location: String(data.get('location') || ''),
        date: String(data.get('date') || ''),
        description: String(data.get('description') || ''),
        photoName: photo instanceof File && photo.size > 0 ? photo.name : '',
        photoData,
        createdAt: new Date().toISOString(),
      });

      alert('Lost item details saved successfully!');
      form.reset();
    } catch (error) {
      console.error('Error saving lost item:', error);
      alert('Unable to save this item. Try a smaller image file.');
    }
  }

  return (
    <section className="inner-page">
      <h1>Report Lost Item 📝</h1>
      <p>Tell us about the item you lost.</p>

      <form onSubmit={handleSubmit} className="report-form">
        <input name="name" type="text" placeholder="Item name" required />

        <select name="category" defaultValue="" required>
          <option value="" disabled>Select category</option>
          <option value="Electronics">Electronics</option>
          <option value="Bags & Backpacks">Bags & Backpacks</option>
          <option value="Keys & Cards">Keys & Cards</option>
          <option value="Books">Books</option>
          <option value="Other">Other</option>
        </select>

        <input
          name="location"
          type="text"
          placeholder="Last seen location"
          required
        />

        <input name="date" type="date" required />

        <textarea
          name="description"
          placeholder="Describe your lost item"
          required
        />

        <label className="upload-label">
          📷 Upload item photo
          <input name="photo" type="file" accept="image/*" />
        </label>

        <button type="submit" className="report-btn">
          Submit Lost Item
        </button>
      </form>
    </section>
  );
}

function ReportFound() {
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const data = new FormData(form);
    const photo = data.get('photo');
    let photoData = '';

    if (photo instanceof File && photo.size > 0) {
      if (!photo.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }

      try {
        photoData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error('Unable to read photo'));
          reader.readAsDataURL(photo);
        });
      } catch {
        alert('Unable to read the photo. Please choose another image.');
        return;
      }
    }

    try {
      await saveItemToDatabase({
        id: crypto.randomUUID(),
        type: 'found',
        name: String(data.get('name') || ''),
        category: String(data.get('category') || ''),
        location: String(data.get('location') || ''),
        date: String(data.get('date') || ''),
        description: String(data.get('description') || ''),
        photoName: photo instanceof File && photo.size > 0 ? photo.name : '',
        photoData,
        createdAt: new Date().toISOString(),
      });

      alert('Found item details saved successfully!');
      form.reset();
    } catch (error) {
      console.error('Error saving found item:', error);
      alert('Unable to save this item. Try a smaller image file.');
    }
  }

  return (
    <section className="inner-page">
      <h1>Report Found Item 🎒</h1>
      <p>Help someone recover their belongings.</p>

      <form onSubmit={handleSubmit} className="report-form">
        <input name="name" type="text" placeholder="Item name" required />

        <select name="category" defaultValue="" required>
          <option value="" disabled>Select category</option>
          <option value="Electronics">Electronics</option>
          <option value="Bags & Backpacks">Bags & Backpacks</option>
          <option value="Keys & Cards">Keys & Cards</option>
          <option value="Books">Books</option>
          <option value="Other">Other</option>
        </select>

        <input name="location" type="text" placeholder="Found location" required />
        <input name="date" type="date" required />

        <textarea
          name="description"
          placeholder="Describe the found item"
          required
        />

        <label className="upload-label">
          📷 Upload item photo
          <input name="photo" type="file" accept="image/*" />
        </label>

        <button type="submit" className="report-btn">
          Submit Found Item
        </button>
      </form>
    </section>
  );
}

function Login() {
  return (
    <section className="inner-page">
      <h1>Welcome Back 💗</h1>
      <p>Login to your FindIt AI account.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          alert('Authentication will be connected later.');
        }}
      >
        <input type="email" placeholder="Email address" required />
        <input type="password" placeholder="Password" required />
        <button type="submit" className="report-btn">Login</button>
      </form>
    </section>
  );
}
type FindItItem = ReturnType<typeof getItems>[number];
function compareText(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function getPossibleMatches(items: FindItItem[]) {
  const lostItems = items.filter((item) => item.type === 'lost');
  const foundItems = items.filter((item) => item.type === 'found');

  return lostItems.flatMap((lost) =>
    foundItems
      .filter(
        (found) =>
          compareText(lost.name, found.name) ||
          (compareText(lost.category, found.category) &&
            compareText(lost.location, found.location))
      )
      .map((found) => ({ lost, found }))
  );
}

function Dashboard() {
  const [items, setItems] = useState<ReturnType<typeof getItems>>([]);
  useEffect(() => {
  getItemsFromDatabase()
    .then((data) => setItems(data))
    .catch((error) => {
      console.error('Error loading dashboard items:', error);
    });
}, []);

  async function refreshItems() {
  try {
    const data = await getItemsFromDatabase();
    setItems(data);
  } catch (error) {
    console.error('Error refreshing dashboard items:', error);
    alert('Unable to refresh items. Please check whether the backend is running.');
  }
}

  const lostItems = items.filter((item) => item.type === 'lost');
  const foundItems = items.filter((item) => item.type === 'found');
  const matches = getPossibleMatches(items);

  return (
    <section className="inner-page">
      <h1>My Dashboard 📊</h1>
      <p>Manage your reports and track item recovery.</p>

      <button type="button" className="report-btn" onClick={refreshItems}>
        Refresh Items
      </button>

      <div className="dashboard-card">
        <h3>My Lost Items 🔍 ({lostItems.length})</h3>

        {lostItems.length === 0 ? (
          <p>No lost items reported yet.</p>
        ) : (
          lostItems.map((item) => (
            <div key={item.id}>
              <hr />
              <h4>{item.name}</h4>
              <ItemPhoto photoData={item.photoData} name={item.name} />
              <p>Category: {item.category}</p>
              <p>Location: {item.location}</p>
              <p>Date: {item.date}</p>
              <p>{item.description}</p>
            </div>
          ))
        )}
      </div>

      <div className="dashboard-card">
        <h3>Found Items 🎒 ({foundItems.length})</h3>

        {foundItems.length === 0 ? (
          <p>No found items reported yet.</p>
        ) : (
          foundItems.map((item) => (
            <div key={item.id}>
              <hr />
              <h4>{item.name}</h4>
              <ItemPhoto photoData={item.photoData} name={item.name} />
              <p>Category: {item.category}</p>
              <p>Location: {item.location}</p>
              <p>Date: {item.date}</p>
              <p>{item.description}</p>
            </div>
          ))
        )}
      </div>

     <div className="dashboard-card">
  <h3>AI Matches 🤖 ({matches.length})</h3>

  {matches.length === 0 ? (
    <p>No possible matches found yet. Report both lost and found items with matching details.</p>
  ) : (
    matches.map(({ lost, found }) => (
      <div key={`${lost.id}-${found.id}`}>
        <hr />
        <h4>💗 Possible Match Found!</h4>

        <p><strong>Lost Item:</strong> {lost.name}</p>
        <p><strong>Found Item:</strong> {found.name}</p>

        <p><strong>Category:</strong> {lost.category}</p>
        <p><strong>Lost Location:</strong> {lost.location}</p>
        <p><strong>Found Location:</strong> {found.location}</p>

        <p>🤖 These items have similar details. Please verify manually.</p>
      </div>
    ))
  )}
</div>
    </section>
  );
}

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">FindIt <span>AI</span></Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/browse">Browse Items</Link>
        <Link to="/report-lost">Report Lost</Link>
        <Link to="/report-found">Report Found</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/login" className="login-btn">Login</Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<BrowseItems />} />
        <Route path="/report-lost" element={<ReportLost />} />
        <Route path="/report-found" element={<ReportFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Home />} />
      </Routes>

      <footer className="site-footer">
        <p>© 2026 FindIt AI · Helping lost items find their way home 💗</p>
      </footer>
    </BrowserRouter>
  );
}

export default App;
