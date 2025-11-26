'use client'

interface ObjectivesDisplayProps {
    teams: any[];
  }

  export default function ObjectivesDisplay({ teams }: 
  ObjectivesDisplayProps) {
    const blueTeam = teams.find(t => t.teamId === 100);
    const redTeam = teams.find(t => t.teamId === 200);

    const ObjectiveRow = ({ team, color, align }: { team: any; color: string; align: string }) => (
      <div>
        <div className={`flex gap-2 text-xs items-center ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
            <div className="flex items-center gap-1">
                <span className="font-bold  text-purple-400">DRAKE</span>
                <span>{team.objectives.dragon.kills}</span>
            </div>
            <div className="flex items-center gap-1">
                <span className="font-bold text-yellow-400">BARON</span>
                <span>{team.objectives.baron.kills}
                </span>
            </div>
            <div className="flex items-center gap-1">
                <span className="font-bold text-gray-400">TOWER</span>
                <span>{team.objectives.tower.kills}
                </span>
            </div>
            <div className="flex items-center gap-1">
                <span className="font-bold text-orange-400">ATAKHAN</span>
                <span>{team.objectives.atakhan.kills}
                </span>
            </div>
        </div>
      </div>
    );

    return (
      <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-gray-800/30 rounded">
        <ObjectiveRow team={blueTeam} color="text-blue-400" align="left" />
        <ObjectiveRow team={redTeam} color="text-red-400" align="right" />
      </div>
    );
  }
