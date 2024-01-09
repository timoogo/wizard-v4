import path from 'path';

/**
 * Extrait le nom du dernier dossier d'un chemin de fichier.
 * Fonctionne sur différentes plateformes (Windows, Mac, Linux).
 *
 * @param filePath - Le chemin complet du fichier ou dossier.
 * @returns Le nom du dernier dossier dans le chemin.
 */
export function getLastFolderName(filePath: string): string {
    // Correction du chemin pour les systèmes Windows
    const correctedPath = process.platform === "win32" ? filePath.replace(/^\/+/g, '') : filePath;

    // Extraction du nom du dernier dossier
    return path.basename(correctedPath);
}
