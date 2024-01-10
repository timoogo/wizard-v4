import { GenericEntityFront } from "@/librairy/interfaces/GenericModel";

export interface  GenericPageProps {
    genericEntities: GenericEntityFront[];
    modelEntity: any;
    entityConfig: {
        entityName: string; // Par exemple: 'user' ou 'book'
        displayNameProperty: string; // Propriété à utiliser pour le titre, par exemple: 'username' ou 'title'
        excludedColumns: string[]; // Colonnes à exclure
        // Ajouter d'autres configurations si nécessaire
    };
}