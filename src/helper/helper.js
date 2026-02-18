import moment from "moment";
export function dateViewFormating(data) {
  if (data) {
    try {
      const date = new Date(data);
      const tmpDate = moment(date).format("DD-MM-YYYY");
      return tmpDate;
    } catch (err) {
      console.error("error", err);
      return "-";
    }
  }
  return "-";
}

export function Detail({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

export function Divider() {
  return <div className="border-t" />;
}

export function breadcrumb(bill, navigate) {
  return  ( 
  
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <span
          onClick={() => navigate("/sales")}
          className="cursor-pointer hover:underline text-gray-600"
        >
          Sales
        </span>
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-800">
          {bill.billNumber}
        </span>
      </div>
      )
}
export function getAlignClass(align) {
  switch (align) {
    case "right":
      return "text-right";
    case "center":
      return "text-center";
    default:
      return "text-left";
  }
}