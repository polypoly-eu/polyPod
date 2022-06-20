export function readmeTemplate(feature_name, description) {
    return `
# ${feature_name}

${description}

## Build project

\`npm run build\`

## Run Feature 

Open \`dist/index.html\` in your favorite browser.
    `;
}
