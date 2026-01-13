import { db } from "../firebase/config";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

export const rankingService = {
  getTopStudents: (count = 10) => {
    const q = query(
      collection(db, "users"),
      where("role", "==", "student"),
      orderBy("score", "desc"),
      limit(count)
    );
    return getDocs(q);
  }
};
