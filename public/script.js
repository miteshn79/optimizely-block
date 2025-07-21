const images = [
    { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400", label: "Image 1" },
    { url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400", label: "Image 2" },
    { url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400", label: "Image 3" }
  ];
  
  const gallery = document.getElementById('gallery');
  let selectedIdx = 0;
  
  function renderGallery() {
    gallery.innerHTML = '';
    images.forEach((img, idx) => {
      const card = document.createElement('div');
      card.className = 'card' + (selectedIdx === idx ? ' selected' : '');
      card.innerHTML = `<img src="${img.url}" /><div>${img.label}</div>`;
      card.onclick = () => {
        selectedIdx = idx;
        renderGallery();
      };
      gallery.appendChild(card);
    });
  }
  
  renderGallery();
  
  document.getElementById('saveBtn').onclick = function() {
    const img = images[selectedIdx];
    // push HTML to Content Builder
    ContentBlockSDK.setContent(`<img src="${img.url}" alt="${img.label}" style="max-width: 100%;">`);
    ContentBlockSDK.close();
  };
  