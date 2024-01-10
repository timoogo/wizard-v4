import path from 'path';
import * as fs from 'fs';

export const modelToTypes = (filePath: string) => {
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Extraire les noms des entités et les types de leurs propriétés
    const entityNames = Object.keys(jsonData.definitions);
    let typesContent = entityNames.map(entity => {
        const properties = jsonData.definitions[entity].properties;
        const props = Object.keys(properties).map(prop => {
            return `${prop}: '${properties[prop].type}'`;
        }).join('; ');
        return `export type ${entity} = { ${props} };`;
    }).join('\n\n');

    // Générer le contenu du fichier TypeScript pour AvailableEntity
    const tsContent = `
export type AvailableEntity = ${entityNames.map(name => `'${name}'`).join(' | ')};

${typesContent}
`;

    // Chemin et nom du fichier TypeScript de sortie
    const outputPath = path.join(process.cwd(), 'librairy/types/AvailableTypes.ts');

    // Écrire le type dans le fichier TypeScript
    fs.writeFileSync(outputPath, tsContent);

    if (fs.existsSync(outputPath)) {
        console.log("Le fichier AvailableTypes.ts a été généré avec succès !" + outputPath);
    } else {
        const error = new Error("Une erreur est survenue lors de la génération du fichier.");
        console.error(`${error.name}: ${error.message}`);
    }

    return tsContent;
}
