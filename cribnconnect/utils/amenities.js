import AirVent from "@/components/svgs/airVent";
import BathTub from "@/components/svgs/bathTub";
import BBQGrill from "@/components/svgs/bbqGrill";
import Beach from "@/components/svgs/beach";
import Electricity from "@/components/svgs/electricity";
import Fireplace from "@/components/svgs/fireplace";
import Generator from "@/components/svgs/generator";
import Gym from "@/components/svgs/gym";
import HomeAssistant from "@/components/svgs/homeAssistant";
import IndoorDining from "@/components/svgs/indoorDining";
import Kitchen from "@/components/svgs/kichen";
import OutdoorDining from "@/components/svgs/outdoorDining";
import Parking from "@/components/svgs/parking";
import Piano from "@/components/svgs/piano";
import Pool from "@/components/svgs/pool";
import PoolBall from "@/components/svgs/poolBall";
import Refrigerator from "@/components/svgs/refrigerator";
import Security from "@/components/svgs/security";
import SmartLock from "@/components/svgs/smartLock";
import Tv from "@/components/svgs/tv";
import Washer from "@/components/svgs/washer";
import Water from "@/components/svgs/water";
import Wifi from "@/components/svgs/wifi";
import Workspace from "@/components/svgs/workspace";


export const basicAmenities = [
    { name: "WIFI", icon: Wifi },
    { name: "TV", icon: Tv },
    { name: "Smart Lock", icon: SmartLock },
    { name: "Air Conditioning", icon: AirVent },
    { name: "Refrigerator", icon: Refrigerator },
    { name: "Kitchen", icon: Kitchen },
    { name: "Washer", icon: Washer },
    { name: "Indoor Dining", icon: IndoorDining },
    { name: "Electricity", icon: Electricity },
    { name: "Clean Water", icon: Water },
  ];


export const luxuryAmenities = [
    { name: "Workspace", icon: Workspace },
    { name: "Beach/Lake Access", icon: Beach },
    { name: "Pool Ball", icon: PoolBall },
    { name: "Outdoor Dining", icon: OutdoorDining },
    { name: "Fireplace", icon: Fireplace },
    { name: "Private Gym", icon: Gym },
    { name: "Private Pool", icon: Pool },
    { name: "Private Parking", icon: Parking },
    { name: "BBQ Grill", icon: BBQGrill },
    { name: "Voice Assistant", icon: HomeAssistant },
    { name: "Indoor Piano", icon: Piano },
    { name: "Bathtub", icon: BathTub },
  ];


export const sharedAmenities = [
    { name: "Shared Pool", icon: Pool },
    { name: "Shared Gym", icon: Gym },
    { name: "Shared Workspace", icon: Workspace },
    { name: "Security", icon: Security },
    { name: "Shared Parking", icon: Parking },
    { name: "Generator", icon: Generator },
  ];