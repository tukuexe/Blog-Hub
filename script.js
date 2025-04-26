// Popup Welcome Messages
const popupMessages = [
    "Welcome to Dream Journal!",
    "Write. Share. Archive your thoughts.",
    "Let's get you started."
];
let popupIndex = 0;
const popupContainer = document.getElementById('popup-container');
const popupMessage = document.getElementById('popup-message');
const nextPopup = document.getElementById('next-popup');
const authContainer = document.getElementById('auth-container');
const blogContainer = document.getElementById('blog-container');

nextPopup.addEventListener('click', () => {
    popupIndex++;
    if (popupIndex < popupMessages.length) {
        popupMessage.textContent = popupMessages[popupIndex];
    } else {
        popupContainer.classList.add('hidden');
        authContainer.classList.remove('hidden');
    }
});

popupMessage.textContent = popupMessages[popupIndex];

// Registration and Login
const passInput = document.getElementById('passcode-input');
const registerBtn = document.getElementById('register-key');
const loginBtn = document.getElementById('login-key');
const authMsg = document.getElementById('auth-message');

registerBtn.addEventListener('click', () => {
    const passcode = passInput.value;
    if (passcode.length < 6) {
        authMsg.textContent = "Passcode must be at least 6 characters.";
        return;
    }
    localStorage.setItem('dreamjournal_key', passcode);
    authMsg.textContent = "Key registered successfully!";
    setTimeout(loadBlogPage, 1000);
});

loginBtn.addEventListener('click', () => {
    const passcode = passInput.value;
    const savedPasscode = localStorage.getItem('dreamjournal_key');
    if (passcode === savedPasscode) {
        authMsg.textContent = "Login successful!";
        setTimeout(loadBlogPage, 1000);
    } else {
        authMsg.textContent = "Incorrect passcode.";
    }
});

// Load Blog Page
function loadBlogPage() {
    authContainer.classList.add('hidden');
    blogContainer.classList.remove('hidden');
    loadBlogs();
}

// Blog System
const blogList = document.getElementById('blog-list');
const blogTitle = document.getElementById('blog-title');
const blogBody = document.getElementById('blog-body');
const saveBlogBtn = document.getElementById('save-blog');
const editBlogBtn = document.getElementById('edit-blog');
const deleteBlogBtn = document.getElementById('delete-blog');
const archiveBlogBtn = document.getElementById('archive-blog');
const logoutBtn = document.getElementById('logout');

let selectedBlogId = null;

saveBlogBtn.addEventListener('click', () => {
    const title = blogTitle.value;
    const body = blogBody.value;
    if (!title || !body) {
        alert("Both Title and Body are required.");
        return;
    }
    const blogs = JSON.parse(localStorage.getItem('dreamjournal_blogs')) || [];
    const newBlog = {
        id: Date.now(),
        title,
        body,
        archived: false
    };
    blogs.push(newBlog);
    localStorage.setItem('dreamjournal_blogs', JSON.stringify(blogs));
    loadBlogs();
    blogTitle.value = "";
    blogBody.value = "";
    alert("Blog Saved Successfully!");
});

function loadBlogs() {
    blogList.innerHTML = "";
    const blogs = JSON.parse(localStorage.getItem('dreamjournal_blogs')) || [];
    blogs.filter(blog => !blog.archived).forEach(blog => {
        const li = document.createElement('li');
        li.textContent = blog.title;
        li.addEventListener('click', () => {
            blogTitle.value = blog.title;
            blogBody.value = blog.body;
            selectedBlogId = blog.id;
        });
        blogList.appendChild(li);
    });
}

editBlogBtn.addEventListener('click', () => {
    if (!selectedBlogId) {
        alert("Select a blog first.");
        return;
    }
    const blogs = JSON.parse(localStorage.getItem('dreamjournal_blogs')) || [];
    const blog = blogs.find(b => b.id === selectedBlogId);
    if (blog) {
        blog.title = blogTitle.value;
        blog.body = blogBody.value;
        localStorage.setItem('dreamjournal_blogs', JSON.stringify(blogs));
        loadBlogs();
        alert("Blog Updated Successfully!");
    }
});

deleteBlogBtn.addEventListener('click', () => {
    if (!selectedBlogId) {
        alert("Select a blog first.");
        return;
    }
    if (!confirm("Are you sure you want to delete this blog?")) return;
    const blogs = JSON.parse(localStorage.getItem('dreamjournal_blogs')) || [];
    const updatedBlogs = blogs.filter(b => b.id !== selectedBlogId);
    localStorage.setItem('dreamjournal_blogs', JSON.stringify(updatedBlogs));
    loadBlogs();
    blogTitle.value = "";
    blogBody.value = "";
    selectedBlogId = null;
    alert("Blog Deleted Successfully!");
});

archiveBlogBtn.addEventListener('click', () => {
    if (!selectedBlogId) {
        alert("Select a blog first.");
        return;
    }
    const blogs = JSON.parse(localStorage.getItem('dreamjournal_blogs')) || [];
    const blog = blogs.find(b => b.id === selectedBlogId);
    if (blog) {
        blog.archived = true;
        localStorage.setItem('dreamjournal_blogs', JSON.stringify(blogs));
        loadBlogs();
        blogTitle.value = "";
        blogBody.value = "";
        selectedBlogId = null;
        alert("Blog Archived Successfully!");
    }
});

logoutBtn.addEventListener('click', () => {
    location.reload();
});
