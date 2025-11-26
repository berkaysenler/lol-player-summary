'use client'

interface ObjectivesDisplayProps {
    teams: any[];
  }

  export default function ObjectivesDisplay({ teams }: 
  ObjectivesDisplayProps) {
    const blueTeam = teams.find(t => t.teamId === 100);
    const redTeam = teams.find(t => t.teamId === 200);

    const ObjectiveRow = ({ team, color }: { team: any; color: string }) => (
      <div>
        {/* <h4 className={`text-sm font-bold ${color} mb-1`}>
          {team.teamId === 100 ? 'BlueTeam' : 'Red Team'}
        </h4> */}
        <div className="flex gap-2 text-xs items-center">
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
        <ObjectiveRow team={blueTeam} color="text-blue-400" />
        <ObjectiveRow team={redTeam} color="text-red-400" />
      </div>
    );
  }
