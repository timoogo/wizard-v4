import path from "path";
import {getLastFolderName} from "@/librairy/utils/getLastFolderName";
import fs from "fs";
import {JsonModelData} from "@/librairy/interfaces/GenericModel";



export function init(currentFullPath: string) {
    // 1. Combinaison du chemin actuel de travail avec un chemin relatif pour obtenir le chemin complet du fichier JSON.
    const jsonFilePath = path.join(process.cwd(), 'prisma/generated/json/json-schema.json');
    const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
    // 3. Utilisation d'une fonction utilitaire pour extraire le nom du dernier dossier à partir du chemin complet.
    const currentDir = getLastFolderName(currentFullPath);
    // 5. Transformation de la chaîne JSON en un objet JavaScript.
    const jsonModelData: JsonModelData = JSON.parse(jsonData);
    return jsonModelData;
}