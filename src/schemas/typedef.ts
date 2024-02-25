const typeDefs = `#graphql
type User {
    _id: ID!
    name: String!
    email: String!
    password: String!
  }
  
  type AuthPayload {
    token: String!
    user: User!
  }

  type protectedData {
      user: User!
      protectedData: String!
  }

  type Code {
    filename: String!
    code: String
  }

  type Sandbox {
    _id: ID!
    name: String!
    type: String!
    codes: [Code!]!
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    password: String!
    sandbox: [Sandbox!]
  }

  type UserSandboxResponse {
    user: User
  }

  type GetSandboxResponse {
    sandbox: Sandbox
    port: Int
  }

  type Query {
    getUserSandbox(id: String!): UserSandboxResponse!
    getSandbox(id: String!): GetSandboxResponse
    getActivePort: [Int]
    getOutput(port: Int): String
  }

  type Mutation {
    signup(name: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    createSandbox(name: String!,type:String!,token: String!): Sandbox
    deleteSandbox(id: String!,token: String!):String
    updateSandboxCode(sandboxId: String!,filename: String!,code: String,port:Int):String
    deleteSandboxFile(sandboxId: String!,filename: String!,port:Int):String
    cleanUpSandbox(port: Int):String
  }


`;
export { typeDefs };
