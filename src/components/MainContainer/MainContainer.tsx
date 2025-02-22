import FilterSection from "../FilterSection/FilterSection";
import TableComponent from "../TableComponent/TableComponent";
import BoardComponent from "../BoardComponent/BoardComponent";
import styles from "./MainContainer.module.css"; 
import UpdateTask from "../UpdateTask/UpdateTask";
import BatchUpdateContainer from "../BatchUpdateComponent/BatchUpdateComponent";
import { useTaskManagement } from "../../hooks/useTaskManagement ";
const MainContainer = () => {
const {tab,enableEditing}=useTaskManagement();
  return (
    <div className={styles.mainContainer}>
      <FilterSection />
      { tab==='list' && <> <TableComponent />
    <div style={{position:'absolute',bottom:'30px'}}> <BatchUpdateContainer /> </div>  </>}
   { enableEditing&&  <UpdateTask />}
     { tab==='board'&&<BoardComponent />}
    </div>
  );
};

export default MainContainer;