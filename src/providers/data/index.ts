import graphqlDataProvider, { 
    GraphQLClient,
    liveProvider as graphqlLiveProvider
} from "@refinedev/nestjs-query"
import { fetchWrapper } from "./fetch-wrapper"
import { createClient } from "graphql-ws"

// ✅ URL de base de l'API HTTP
export const API_BASE_URL = 'https://api.crm.refine.dev'

// ✅ URL GraphQL HTTP (même que BASE ici)
export const API_URL = 'https://api.crm.refine.dev'

// ✅ URL du serveur WebSocket pour le live updates GraphQL
export const WS_URL = 'wss://api.crm.refine.dev/graphql'

// ✅ Création du client GraphQL Refine avec fetch personnalisé
export const client = new GraphQLClient(API_URL, {
    fetch: (url:string, options: RequestInit) => {
        try {
            // Utilise le fetchWrapper custom pour gérer les requêtes et erreurs
            return fetchWrapper(url, options)
        } catch (error) {
            // Propage proprement l’erreur si y'a un souci
            return Promise.reject(error as Error)
        }
    }
})

// ✅ Création du client WebSocket pour GraphQL en live (subscriptions)
export const wsClient = typeof window !== "undefined" 
    ? createClient({
        url: WS_URL,
        connectionParams: () => {
            // Récupération du token d’authentification
            const accessToken = localStorage.getItem('access_token');

            return {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        }
    })
    : undefined

// ✅ Data Provider GraphQL branché sur le client configuré
export const dataProvider = graphqlDataProvider(client)

// ✅ Live Provider configuré si le wsClient est disponible (navigateur uniquement)
export const liveProvider = wsClient ? graphqlLiveProvider(wsClient) : undefined