// lire .json
import prisma from "@/prisma/prisma";

// fn(model) => DEFINNITION

import {GenericEntityFront, JsonModelData} from "@/librairy/interfaces/GenericModel";
import {AvailableEntity} from "@/librairy/types/AvailableEntity";

export const createModelType = (modelName: AvailableEntity, jsonModelData: any): GenericEntityFront | null => {
    // Vérification de l'existence de la clé
    if (modelName in jsonModelData.definitions) {
        const modelDefinition = jsonModelData.definitions[modelName];

        // Vérification supplémentaire pour s'assurer que modelDefinition est du type attendu
        if (typeof modelDefinition === 'object' && modelDefinition !== null && 'properties' in modelDefinition) {
            const generatedModel: GenericEntityFront = {};

            // Parcours des propriétés et création du modèle
            Object.keys(modelDefinition.properties).forEach(key => {
                const property = modelDefinition.properties[key];
                generatedModel[key] = {
                    type: Array.isArray(property.type) ? property.type : [property.type],
                    // Ajoutez ici d'autres logiques si nécessaire
                };
            });

            return generatedModel;
        } else {
            console.error("Type de modèle incorrect pour", modelName);
            return null;
        }
    } else {
        console.error("Modèle non trouvé :", modelName);
        return null;
    }
};
