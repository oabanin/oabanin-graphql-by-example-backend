import Jobs from "./models/jobs";
import jobs from "./models/jobs";
import Companies from "./models/companies";

const resolvers = {
  Query: {
    jobs: () => Jobs.find({}).exec(),
  },
  Job: {
    company: async (job: { _id: string; compId: string; title: string }) => {
      return Companies.findById(job.compId).exec();
    },
  },
};

export default resolvers;
