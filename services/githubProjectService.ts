import { githubProjectsDao } from '@/db/models/daos/githubProjects';
import type { githubProjects } from '@/db/schema';

export interface CreateGithubProjectData {
  url: string;
  owner: string;
  repo: string;
  branch: string;
  commitId: string;
  userId: string;
}

export const GithubProjectService = {
  async findById(id: number) {
    return await githubProjectsDao.findById(id);
  },

  async findAll() {
    return await githubProjectsDao.findAll();
  },

  async findByUserId(userId: string) {
    return await githubProjectsDao.findByUserId(userId);
  },

  async findByUrl(url: string) {
    return await githubProjectsDao.findByUrl(url);
  },

  async create(data: CreateGithubProjectData) {
    // Check if the project already exists for this user
    const existingProject = await githubProjectsDao.findByUrl(data.url);
    if (existingProject && existingProject.userId === data.userId) {
      return existingProject;
    }

    return await githubProjectsDao.create(data);
  },

  async update(id: number, data: Partial<typeof githubProjects.$inferInsert>) {
    return await githubProjectsDao.update(id, data);
  },

  async delete(id: number) {
    await githubProjectsDao.delete(id);
  },
};
