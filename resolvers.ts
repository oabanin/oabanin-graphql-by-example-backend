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
    job: (root: any, args: { id: string }) => {
      return Jobs.findById(args.id).exec();
    },
    jobs: () => {
      return Jobs.find({}).exec();
    },
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
    company: async (
      job: { compId: string },
      _: any,
      { companyLoader }: { companyLoader: any }
    ) => {
      return await companyLoader.load(job.compId); //dataloader
      //return Companies.findById(job.compId).exec(); //no dataloader
    },
  },
  Company: {
    jobs: async (company: { _id: string }) => {
      return Jobs.find({ compId: company._id }).exec(); // no dataloader
    },
  },
};

export default resolvers;
