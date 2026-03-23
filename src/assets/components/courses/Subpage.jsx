import { useParams } from "react-router-dom";
import Datascience from "./Datascience";
import Dataanalytics from "./Dataanalytics";
import Microsoftpbi from "./Microsoftpbi";
import Javafullstack from "./Javafullstack";
import Pythonfullstack from "./Pythonfullstack";
import Aws from "./Aws";
import Cisco from "./Cisco";
import Devops from "./Devops";
import Digitalmarketing from "./Digitalmarketing";
import Dotnetfullstack from "./Dotnetfullstack";
import Istqb from "./Istqb";
import Meanfullstack from "./Meanfullstack";
import Mernfullstack from "./Mernfullstack";
import Mobileapp from "./Mobileapp";
import Msazure from "./Msazure";
import Networking from "./Networking";
import Phpfullstack from "./Phpfullstack";
import Redhat from "./Redhat";
import Redhatc from "./Redhatc";
import Salesforce from "./Salesforce";
import Softwareauto from "./Softwareauto";
import Softwaretesting from "./Softwaretesting";
import Uiux from "./Uiux";
import Wd from "./Wd";

const SubcoursePage = () => {
  const { subcourse } = useParams();

  if (subcourse === "data-science-ai-course") return <Datascience />;
  if (subcourse === "data-analytics-course") return <Dataanalytics />;
  if (subcourse === "microsoft-power-bi-course") return <Microsoftpbi/>
  if (subcourse === "java-full-stack-course") return <Javafullstack/>
  if (subcourse === "python-full-stack-course") return <Pythonfullstack/>
  if (subcourse === "aws-architect-associate-course") return <Aws/>
  if (subcourse === "cisco-certified-network-associate(ccna)-course") return <Cisco/>
  if (subcourse === "devops-engineer-course") return <Devops/>
  if (subcourse === "digital-marketing-expert") return <Digitalmarketing/>
  if (subcourse === ".net-core-full-stack-course") return <Dotnetfullstack/>
  if (subcourse === "istqb-manual-testing-course") return <Istqb/>
  if (subcourse === "mean-full-stack-course") return <Meanfullstack/>
  if (subcourse === "mern-full-stack-course") return <Mernfullstack/>
  if (subcourse === "android-ios-mobile-app-course-in-google-flutter-course") return <Mobileapp/>
  if (subcourse === "ms-azure-cloud-administrator-course") return <Msazure/>
  if (subcourse === "networking-server-cloud-administration-course") return <Networking/>
  if (subcourse === "php-full-stack-course") return <Phpfullstack/>
  if (subcourse === "red-hat-certified-system-administrator-(rhcsa)-course") return <Redhat/>
  if (subcourse === "red-hat-certified-engineer-(rhce)-course") return <Redhatc/>
  if (subcourse === "salesforce") return <Salesforce/>
  if (subcourse === "software-automation-testing-course") return <Softwareauto/>
  if (subcourse === "software-testing-advanced-course") return <Softwaretesting/>
  if (subcourse === "ui-ux-design-course") return <Uiux/>
  if (subcourse === "website-designing-course") return <Wd/>
  
  return <div>Course not found</div>;
};

export default SubcoursePage;