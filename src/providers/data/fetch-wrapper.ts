import { GraphQLClient } from "@refinedev/nestjs-query";
import { GraphQLFormattedError } from "graphql"

// Type représentant une erreur formatée avec un message et un code
type Error = {
    message: string,
    statusCode: string
}

/**
 * Effectue une requête HTTP personnalisée avec gestion des headers
 * et ajout automatique du token d'authentification.
 *
 * @param url - URL de la requête
 * @param options - Options de la requête (méthode, headers, body...)
 * @returns Réponse HTTP brute
 */
const customFetch = async (url:string, options:RequestInit) => {
    // Récupération du token depuis le localStorage
    const accessToken = localStorage.getItem('access_token');

    // Récupération des headers existants
    const headers = options.headers as Record<string, string>;

    // Exécution de la requête fetch avec les headers personnalisés
    return await fetch(url, {
        ...options,
        headers: {
            ...headers,
            Authorization: headers?.Authorization || `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "Apollo-Require-Preflight": "true",
        }
    })
}

/**
 * Extrait et formate les erreurs GraphQL à partir du corps de la réponse.
 *
 * @param body - Corps de la réponse JSON contenant potentiellement des erreurs
 * @returns Une erreur formatée ou null s'il n'y a pas d'erreur
 */
const getGraphQLErrors = (body: Record<"errors", GraphQLFormattedError[] | undefined>):
Error | null => {

    // Si le body est vide, retourne une erreur générique
    if (!body) {
        return {
            message : 'Unknown error',
            statusCode : "INTERNAL_SERVER_ERROR"
        }
    }

    // Si le body contient un tableau d'erreurs
    if ("errors" in body) {
        const errors = body?.errors;

        // Concatène tous les messages d'erreur en une seule chaîne
        const messages = errors?.map((error) => error?.message)?.join("")

        // Récupère le code d'erreur du premier message
        const code = errors?.[0]?.extensions?.code;

        // Retourne l'objet erreur formaté
        return {
            message : messages || JSON.stringify(errors),
            statusCode: code || "500"
        }
    }

    // Aucun problème détecté
    return null;
}

/**
 * Wrapper autour de fetch qui ajoute la gestion des tokens,
 * les headers, et le parsing automatique des erreurs GraphQL.
 *
 * @param url - URL de la requête
 * @param options - Options de la requête
 * @returns La réponse HTTP si tout va bien, sinon lève une erreur formatée
 */
export const fetchWrapper = async (url:string, options:RequestInit) => {
    // Exécute la requête avec le custom fetch configuré
    const response = await customFetch(url, options);

    // Clone la réponse car elle ne peut être lue qu'une seule fois
    const responseClone = response.clone();

    // Parse le corps JSON de la réponse
    const body = await responseClone.json();

    // Vérifie s'il y a des erreurs GraphQL dans la réponse
    const error = getGraphQLErrors(body);

    // Si une erreur est détectée, elle est levée ici
    if (error) {
        throw (error);
    }

    // Sinon, on retourne la réponse normale
    return response;
}