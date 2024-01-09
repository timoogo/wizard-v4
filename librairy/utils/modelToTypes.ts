
// Chemin vers votre fichier JSON
import path from "path";
import * as fs from "fs";

export const modelToTypes = (filePath: string) => {

// Lire le fichier JSON
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Extraire les noms des entités
    const entityNames = Object.keys(jsonData.definitions);

// Générer le contenu du fichier TypeScript
    const tsContent = `
export type AvailableEntity = ${entityNames.map(name => `'${name}'`).join(' | ')};
`;

// Chemin et nom du fichier TypeScript de sortie
    const outputPath = path.join(process.cwd(), 'librairy/types/AvailableEntity.ts');

// Écrire le type dans le fichier TypeScript
    fs.writeFileSync(outputPath, tsContent);

    if (fs.existsSync(outputPath)) {
        console.log("Le fichier a été généré avec succès !" + outputPath);
    } else {
        const error = new Error("Une erreur est survenue lors de la génération du fichier.");
        console.error(`${error.name}: ${error.message}`);
    }

    return tsContent;
}