import Link from "next/link"
import NearWallet from "../Auth/NearWallet"
import Image from "next/image"

const NavBar: React.FC = () => {
    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <a className="btn btn-ghost">
                    <Image
                        className="rounded-full"
                        src="/logo.jpg"
                        width={30}
                        height={30}
                        alt="echologo"
                    />
                    <div className="flex flex-col">
                        <div className="text-2xl text-left">Echo</div>
                    </div>
                    <div className="text-sm text-left"> - Your personal digital identity</div>
                </a>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <button>Mint your identity</button>
                    </li>
                    <li>
                        <NearWallet />
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default NavBar
