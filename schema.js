const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLSchema } = require("graphql");
const Report = require("./src/models/reportModel");

const ReportType = new GraphQLObjectType({
  name: "Report",
  fields: () => ({
    id: { type: GraphQLString },
    url: { type: GraphQLString },
    performanceScore: { type: GraphQLInt },
    seoScore: { type: GraphQLInt },
    accessibilityScore: { type: GraphQLInt },
    bestPracticesScore: { type: GraphQLInt },
    recommendations: { type: GraphQLString },
    createdAt: { type: GraphQLString },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    getWebsiteReport: {
      type: ReportType,
      args: { url: { type: GraphQLString } },
      async resolve(parent, args) {
        return await Report.findOne({ where: { url: args.url } });
      },
    },
    getAllReports: {
      type: new GraphQLList(ReportType),
      async resolve() {
        return await Report.findAll();
      },
    },
  },
});

// Mutations
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addReport: {
      type: ReportType,
      args: {
        url: { type: GraphQLString },
        performanceScore: { type: GraphQLInt },
        seoScore: { type: GraphQLInt },
        accessibilityScore: { type: GraphQLInt },
        bestPracticesScore: { type: GraphQLInt },
        recommendations: { type: GraphQLString },
      },
      async resolve(parent, args) {
        return await Report.create(args);
      },
    },
  },
});

// Export Schema
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
