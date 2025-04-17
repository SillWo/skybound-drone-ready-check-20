
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { RiskFactor } from './RiskAnalysisDashboard';

interface RiskFactorsChartProps {
  riskFactors: RiskFactor[];
}

export function RiskFactorsChart({ riskFactors }: RiskFactorsChartProps) {
  // Group risk factors by category
  const categoryGroups = riskFactors.reduce((groups, factor) => {
    const category = factor.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(factor);
    return groups;
  }, {} as Record<string, RiskFactor[]>);

  // Create data for pie chart
  const chartData = Object.entries(categoryGroups).map(([category, factors]) => ({
    name: category,
    value: factors.length,
    totalRisk: factors.reduce((sum, factor) => sum + factor.score, 0)
  }));

  // Colors for different categories
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#EC7063'];

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name, props) => {
              // Display both count and total risk score
              if (name === 'value') {
                return [`${value} факторов`, 'Количество'];
              }
              return [value, name];
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
