import makeHTTP from "@pinyinma/http"

export const { baseURL, baseWSURL, initGraphQL, graphql, graphqlTyped, graphqlTypedMany, graphqlTypedPartial, graphqlUpload, http } = makeHTTP(process.env.NODE_ENV === "development", location.hostname)