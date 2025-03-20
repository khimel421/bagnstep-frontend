
import Navbar from "@/components/DashboardNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function page() {
  return (
    <div className="">

      <div className="flex-1">
        {/* <Navbar /> */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Orders</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">1,245</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">$25,300</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sales Trends</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">📈 +12%</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
