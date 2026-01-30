import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export const DynamicPromoCTA = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    className="mt-8 p-6 rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/10"
  >
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary fill-primary" />
          <span className="text-sm font-bold uppercase tracking-wider text-primary">
            Pro Feature
          </span>
        </div>
        <h3 className="text-xl font-bold">Upgrade to Dynamic QR Codes</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Static codes cannot be changed after printing.{" "}
          <strong>Dynamic codes</strong> allow you to update the destination URL
          anytime and track scan locations in real-time.
        </p>
      </div>

      <div className="flex flex-col gap-2 w-full md:w-auto">
        <Link href="/login">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            Get Dynamic Access
          </Button>
        </Link>
        <p className="text-[10px] text-center text-muted-foreground">
          Starting at $5/mo — Cancel anytime
        </p>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-primary/10">
      <div className="text-center">
        <p className="text-xs font-bold">Unlimited Edits</p>
        <p className="text-[10px] text-muted-foreground">
          Fix links after printing
        </p>
      </div>
      <div className="text-center">
        <p className="text-xs font-bold">GPS Analytics</p>
        <p className="text-[10px] text-muted-foreground">
          See where scans happen
        </p>
      </div>
      <div className="text-center">
        <p className="text-xs font-bold">Bulk Export</p>
        <p className="text-[10px] text-muted-foreground">Manage 100+ codes</p>
      </div>
    </div>
  </motion.div>
);
