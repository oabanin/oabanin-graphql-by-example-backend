import Jobs from "./models/jobs";
import Companies from "./models/companies";

type ICreateJobInput = {
  title: string;
  description: string;
  companyId: string;
};

type IUpdateJobInput = {
  id: string;
  title: string;
  description: string;
  companyId: string;
};

function rejectIf(condition: boolean) {
  if (condition) {
    throw new Error("Unauthorized");
  }
}

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
      rejectIf(!user);
      const job = new Jobs({
        compId: user.compId,
        ...input,
      });
      job.save();
      return job;
    },
    deleteJob: (root: any, { id }: { id: string }, { user }: { user: any }) => {
      rejectIf(!user);
      const job = Jobs.findByIdAndDelete(id);
      return job.exec();
    },
    updateJob: (
      root: any,
      { input }: { input: IUpdateJobInput },
      { user }: { user: any }
    ) => {
      rejectIf(!user);
      const job = Jobs.findByIdAndUpdate(
        input.id,
        {
          $set: {
            title: input.title,
            description: input.description,
            compId: input.companyId,
          },
        },
        { new: true }
      );
      return job.exec();
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
