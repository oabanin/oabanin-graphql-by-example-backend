import Jobs from "./models/jobs";
import Companies from "./models/companies";

type ICreateJobInput = {
  title: string;
  description: string;
  companyId: string;
};

const resolvers = {
  Query: {
    company: (root: any, args: { id: string }) => {
      return Companies.findById(args.id).exec();
    },
    job: (root: any, args: { id: string }) => Jobs.findById(args.id).exec(),
    jobs: () => Jobs.find({}).exec(),
  },
  Mutation: {
    createJob: (
      root: any,
      { input }: { input: ICreateJobInput },
      { user }: { user: any }
    ) => {
      if (!user) {
        throw new Error("Unauthorized");
      }
      const job = new Jobs({
        title: input.title,
        description: input.description,
        compId: input.companyId,
      });
      job.save();
      return job;
    },
  },
  Job: {
    company: async (job: { compId: string }) => {
      return Companies.findById(job.compId).exec();
    },
  },
  Company: {
    jobs: async (company: { _id: string }) => {
      return Jobs.find({ compId: company._id }).exec();
    },
  },
};

export default resolvers;
