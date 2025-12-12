/**
 * Configuration for base path
 * This helps handle different deployment environments (localhost vs GitHub Pages)
 */

// Detect if we're on GitHub Pages or localhost
const isGitHubPages = window.location.hostname.includes('github.io');
const repoName = 'cooking'; // Change this to your repository name

// Set base path
const BASE_PATH = isGitHubPages ? `/${repoName}/` : '/';

// Helper function to get correct image path
function getImagePath(imagePath) {
    if (!imagePath) return '';

    // If path already starts with http/https, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // Remove leading ./ or / if present
    const cleanPath = imagePath.replace(/^\.?\//, '');

    // Return path with base
    return BASE_PATH + cleanPath;
}

// Export to window
window.BASE_PATH = BASE_PATH;
window.getImagePath = getImagePath;
