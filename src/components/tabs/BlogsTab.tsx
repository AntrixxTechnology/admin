import React from 'react';
import { FileText, Plus, Edit, Trash2 } from 'lucide-react';
import type { BlogPost } from '../../api/client';

interface BlogsTabProps {
  blogs: BlogPost[];
  onEditBlog: (b: Partial<BlogPost>) => void;
  onDeleteBlog: (id: string) => void;
}

export const BlogsTab: React.FC<BlogsTabProps> = ({ blogs, onEditBlog, onDeleteBlog }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold text-inkBlack">Blogs & Articles</h2>
        <button
          onClick={() => onEditBlog({ is_published: true, author: 'Admin' })}
          className="btn-primary py-2 px-4 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Blog Post
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray200 shadow-cardHover overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray200 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <th className="p-4">Title</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Author</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray100 text-sm">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-bold text-inkBlack">{blog.title}</td>
                  <td className="p-4 text-gray-500">{blog.slug}</td>
                  <td className="p-4 text-gray-500">{blog.author}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${blog.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'}`}>
                      {blog.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4 flex items-center justify-end gap-2">
                    <button onClick={() => onEditBlog(blog)} className="p-2 text-gray-400 hover:text-amberAccent hover:bg-amberAccent/10 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDeleteBlog(blog.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400 text-sm">
                    No blog posts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
