"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useParams } from "next/navigation";

// Define the types based on your Prisma schema and API response
interface User {
  alias: string;
  avatarUrl: string | null;
}

interface Account {
  equity: number;
}

interface TournamentEntry {
  id: string;
  rank: number | null;
  user: User;
  account: Account;
}

interface Tournament {
  id: string;
  name: string;
  description: string | null;
  startTime: string;
  endTime: string;
  rules: any; // You might want to define a stricter type for rules
  entries: TournamentEntry[];
}

export default function TournamentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchTournament = async () => {
        try {
          const response = await fetch(`/api/tournaments/${id}`);
          const data = await response.json();
          if (data.success) {
            setTournament(data.tournament);
          }
        } catch (error) {
          console.error("Failed to fetch tournament details", error);
        } finally {
          setLoading(false);
        }
      };
      fetchTournament();
    }
  }, [id]);

  const handleJoinTournament = async () => {
    setJoining(true);
    try {
      const response = await fetch(`/api/tournaments/${id}/join`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        // Refresh the tournament data to show the new entry
        const refreshResponse = await fetch(`/api/tournaments/${id}`);
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          setTournament(refreshData.tournament);
        }
      } else {
        console.error("Failed to join tournament:", data.error);
      }
    } catch (error) {
      console.error("Failed to join tournament", error);
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return <p>Loading tournament details...</p>;
  }

  if (!tournament) {
    return <p>Tournament not found.</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{tournament.name}</h1>
          <p className="text-muted-foreground">{tournament.description}</p>
        </div>
        <Button onClick={handleJoinTournament} disabled={joining}>
          {joining ? "Joining..." : "Join Tournament"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-right">Equity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tournament.entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.rank || "N/A"}</TableCell>
                      <TableCell>{entry.user.alias}</TableCell>
                      <TableCell className="text-right">${Number(entry.account.equity).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Rules & Info</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Display rules here */}
              <p className="text-sm">Rules will be displayed here.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
