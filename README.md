# Portfolio-PranavMishra-Paranoid
 
# Pranav Pushkar Mishra - Portfolio Website

A modern, responsive portfolio website showcasing game development, machine learning, and miscellaneous projects with distinctive visual themes for each category.

![Portfolio Preview](./preview.png)

## Features

- **Responsive Design**: Fully responsive layout optimized for all screen sizes
- **Distinct Visual Themes**:
  - Game Design: Pixel-inspired typography with red color scheme
  - AI/ML: Clean, professional typography with blue color scheme
  - Miscellaneous: Monospace typography with green color scheme
- **Interactive Elements**:
  - Animated skill bars
  - Particle background effect
  - Project galleries with lightbox
  - Smooth scrolling navigation
  - Dark/light mode toggle
- **SEO Optimized**: Proper metadata and semantic HTML structure

## Technologies Used

- **React.js**: Core framework for building the UI
- **CSS3**: Custom styling with CSS variables for theming
- **JavaScript ES6+**: Modern JavaScript features
- **Framer Motion**: (Optional) For enhanced animations
- **Font Awesome**: For icons

## Project Structure

```
portfolio/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
│       └── images/
├── src/
│   ├── App.js               # Main application component
│   ├── index.js             # Entry point
│   ├── App.css              # Main styles
│   ├── index.css            # Global styles
│   └── components/
│       ├── ParticleBackground.js
│       ├── PixelText.js
│       ├── ThemeSwitch.js
│       ├── TechStackBadge.js
│       ├── ProjectGallery.js
│       └── AnimatedSkillBar.js
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/portfolio.git
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Open your browser and visit `http://localhost:3000`

### Customization

#### 1. Update Personal Information

Edit the About section in `App.js`:

```jsx
<div className="about-text">
  <h1>Your Name</h1>
  <h2>Your Title</h2>
  <p>
    Your bio here...
  </p>
</div>
```

#### 2. Update Projects

Edit the project arrays in `App.js`:

```jsx
const gameProjects = [
  {
    title: "Project Title",
    category: "Category",
    description: "Description...",
    image: "/path/to/image.jpg",
    githubLink: "https://github.com/...",
    demoLink: "https://...",
    techStack: ["Tech1", "Tech2"],
    gallery: [
      "/path/to/gallery1.jpg",
      "/path/to/gallery2.jpg"
    ]
  },
  // More projects...
];
```

#### 3. Custom Styling

Modify CSS variables in `index.css` to customize colors and themes:

```css
:root {
  /* Base Colors */
  --color-bg: #0a0a0a;
  --color-text: #f5f5f5;
  
  /* Theme Colors */
  --game-primary: #ff2d55;
  --game-secondary: #b30021;
  
  --ai-primary: #3d5afe;
  --ai-secondary: #0039cb;
  
  --misc-primary: #00c853;
  --misc-secondary: #009624;
  
  /* More variables... */
}
```

## Deployment

### Option 1: GitHub Pages

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add these scripts to `package.json`:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```

3. Add homepage to `package.json`:
   ```json
   "homepage": "https://your-username.github.io/portfolio"
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

### Option 2: Netlify/Vercel

1. Create an account on [Netlify](https://www.netlify.com/) or [Vercel](https://vercel.com/)
2. Connect your GitHub repository
3. Follow the deployment instructions

## Performance Optimization Tips

1. **Optimize Images**:
   - Use modern formats (WebP)
   - Compress images with tools like [TinyPNG](https://tinypng.com/)
   - Use appropriate image dimensions

2. **Code Splitting**:
   - Use React.lazy() for component lazy loading
   - Split code into smaller chunks

3. **Preload Critical Assets**:
   - Add preload tags for critical resources

4. **Enable Caching**:
   - Add appropriate cache headers in deployment

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

- Fonts: Google Fonts (Press Start 2P, Inter, Space Mono, Roboto)
- Icons: Font Awesome
- Placeholder Images: Use your actual project screenshots

## Contact

Pranav Pushkar Mishra - [Your Email] - [Your LinkedIn]

Project Link: [https://github.com/your-username/portfolio](https://github.com/your-username/portfolio)