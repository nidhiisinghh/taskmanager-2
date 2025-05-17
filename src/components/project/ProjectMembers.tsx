import { useState } from 'react';
import { Mail, UserPlus, X } from 'lucide-react';
import useProjectStore from '../../store/projectStore';

interface ProjectMembersProps {
  projectId: string;
}

const ProjectMembers = ({ projectId }: ProjectMembersProps) => {
  const [email, setEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const { currentProject, addMember } = useProjectStore();

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setIsInviting(true);
      await addMember(projectId, email);
      setEmail('');
    } catch (error) {
      console.error('Error inviting member:', error);
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900">Project Members</h3>
      
      <div className="mt-4">
        <form onSubmit={handleInvite} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email to invite"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={isInviting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md disabled:opacity-50"
          >
            {isInviting ? 'Inviting...' : 'Invite'}
          </button>
        </form>
      </div>

      <div className="mt-4">
        {currentProject?.members.map(member => (
          <div key={member} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{member}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectMembers;