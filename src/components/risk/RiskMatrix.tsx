
import { RiskFactor } from './RiskAnalysisDashboard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RiskMatrixProps {
  riskFactors: RiskFactor[];
}

export function RiskMatrix({ riskFactors }: RiskMatrixProps) {
  const impactLabels = ['Очень низкое', 'Низкое', 'Среднее', 'Высокое', 'Очень высокое'];
  const likelihoodLabels = ['Очень низкая', 'Низкая', 'Средняя', 'Высокая', 'Очень высокая'];
  
  // Create a 5x5 matrix to hold risk factors
  const matrix: RiskFactor[][] = Array(5).fill(null).map(() => Array(5).fill(null));
  
  // Place risk factors in the matrix
  riskFactors.forEach(factor => {
    const row = 5 - factor.likelihood; // Invert for display (5 at top, 1 at bottom)
    const col = factor.impact - 1;
    
    if (!matrix[row][col]) {
      matrix[row][col] = [] as any;
    }
    
    (matrix[row][col] as any).push(factor);
  });
  
  // Get cell background color based on risk score
  const getCellColor = (likelihood: number, impact: number) => {
    const score = likelihood * impact;
    
    if (score <= 4) return 'bg-green-100 hover:bg-green-200';
    if (score <= 9) return 'bg-yellow-100 hover:bg-yellow-200';
    if (score <= 14) return 'bg-orange-100 hover:bg-orange-200';
    return 'bg-red-100 hover:bg-red-200';
  };
  
  // Get risk level name based on score
  const getRiskLevelName = (likelihood: number, impact: number) => {
    const score = likelihood * impact;
    
    if (score <= 4) return 'Низкий';
    if (score <= 9) return 'Средний';
    if (score <= 14) return 'Высокий';
    return 'Критический';
  };

  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="w-24 p-2 border"></th>
            {impactLabels.map((label, index) => (
              <th key={index} className="p-2 border text-center font-medium">
                <div className="rotate-0 md:rotate-0">{label}</div>
                <div className="text-xs">{index + 1}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="p-2 border text-center">
                <div>{likelihoodLabels[4 - rowIndex]}</div>
                <div className="text-xs">{5 - rowIndex}</div>
              </td>
              {row.map((cell, colIndex) => {
                const likelihood = 5 - rowIndex;
                const impact = colIndex + 1;
                const factors = cell as unknown as RiskFactor[] || [];
                
                return (
                  <td
                    key={colIndex}
                    className={`p-1 border text-center h-16 ${getCellColor(likelihood, impact)}`}
                  >
                    <div className="relative h-full">
                      <div className="text-xs mb-1">
                        {likelihood * impact}
                      </div>
                      {factors.length > 0 ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex flex-wrap gap-1 justify-center">
                                {factors.map((factor) => (
                                  <div key={factor.id} className="w-3 h-3 rounded-full bg-blue-500"></div>
                                ))}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-sm font-medium">
                                {getRiskLevelName(likelihood, impact)} риск
                              </div>
                              <ul className="list-disc pl-5 mt-1 text-xs">
                                {factors.map((factor) => (
                                  <li key={factor.id}>{factor.name}</li>
                                ))}
                              </ul>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <div className="text-xs text-gray-500">
                          {getRiskLevelName(likelihood, impact)}
                        </div>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
