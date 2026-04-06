import Link from 'next/link'

type ListProp = {
    name: string,
    id: number
};


export default function List({name, id}: ListProp){

    return(
        <div className="flex justify-center items-center bg-white m-3 rounded-2xl col-start-3 col-end-11">
            <Link href={`/instance/list/${id}`}><h2 className="text-black text-center p-3">{name}</h2></Link>
        </div>
    )

}