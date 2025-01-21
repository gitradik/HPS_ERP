import { ApolloServerPlugin, GraphQLRequestListener } from 'apollo-server-plugin-base';

const normalizeEmailMiddleware: ApolloServerPlugin = {
  async requestDidStart() {
    return {
      async didResolveOperation({ request }) {
        const normalizeEmail = (obj: any) => {
          if (obj && typeof obj === 'object') {
            for (const key of Object.keys(obj)) {
              if (key === 'email' && typeof obj[key] === 'string') {
                obj[key] = obj[key].toLowerCase();
              } else if (typeof obj[key] === 'object') {
                normalizeEmail(obj[key]);
              }
            }
          }
        };

        // Обрабатываем переменные запроса
        if (request.variables) {
          normalizeEmail(request.variables);
        }
      },
    } as GraphQLRequestListener<any>;
  },
};

export { normalizeEmailMiddleware };
