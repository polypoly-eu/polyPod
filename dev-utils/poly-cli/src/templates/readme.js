export function template(feature_name, description) {
    return `
# ${feature_name}

${description}

## Build project

\`npm run build\`

    `;
}
